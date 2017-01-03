/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  // Import methods that your schema can use to interact with your database
  User,
  Widget,
  getUser,
  getViewer,
  getWidget,
  getWidgets,
  getCollections,
  getRecords
} from './database';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    } else if (type === 'Widget') {
      return getWidget(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return userType;
    } else if (obj instanceof Widget)  {
      return widgetType;
    } else if (obj instanceof Collection)  {
      return collectionType;
    } else if (obj instanceof Bucket)  {
      return collectionType;
    } else {
      return null;
    }
  }
);

/**
 * Define your own types here
 */
 const formDummy = {
       form: ["*"],
       schema: {
                  "type": "object",
                  "title": "Types",
                  "properties": {
                    "string": {
                      "type": "string",
                      "minLength": 3
                    },
                    "anotherstring": {
                      "type": "string",
                      "minLength": 3
                    },
                    "integer": {
                      "type": "integer"
                    },
                    "number": {
                      "type": "number"
                    },
                    "boolean": {
                      "type": "boolean"
                    },
                    "radios": {
                      "title": "Basic radio button example",
                      "type": "string",
                      "enum": [
                        "a",
                        "b",
                        "c"
                      ]
                    },
                    "comment": {
                      "title": "Comment",
                      "type": "string",
                      "maxLength": 20,
                      "validationMessage": "Don't be greedy!",
                      "description": "Please write your comment here."
                    }
                  },
                  "required": [
                    "number"
                  ]
                },
       model: {}
   }
 var Bucket = {
     collections: [
       { id:"1",
         title:"Form1",
         form: JSON.stringify(formDummy.form),
         fschema: JSON.stringify(formDummy.schema),
         model: JSON.stringify(formDummy.model)
        },
     ]
 }
/**
*  Types
*/

var widgetType = new GraphQLObjectType({
  name: 'Widget',
  description: 'A shiny widget',
  fields: () => ({
    id: globalIdField('Widget'),
    name: {
      type: GraphQLString,
      description: 'The name of the widget',
    },
  }),
  interfaces: [nodeInterface],
});

var collectionType = new GraphQLObjectType({
  name: 'Collections',
  description: 'A user collections',
  fields: () => ({
    id: globalIdField('Widget'),
    title: {
      type: GraphQLString,
      description: 'Collection - Form Title',
    },
    form: {
      type: GraphQLString,
      description: 'Collection - Form',
    },
    fschema: {
      type: GraphQLString,
      description: 'Collection - Form Schema',
    },
    model: {
      type: GraphQLString,
      description: 'Collection - Form Model',
    },
  }),
  interfaces: [nodeInterface],
});


/**
 * Define your own connection types here
 */

var {connectionType: widgetConnection} =
  connectionDefinitions({name: 'Widget', nodeType: widgetType});

var {connectionType: collectionConnection} =
  connectionDefinitions({name: 'Collection', nodeType: collectionType});


var userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    widgets: {
      type: widgetConnection,
      description: 'A person\'s collection of widgets',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getWidgets(), args),
    },
    collections: {
        type: collectionConnection,
        description: 'A person\'s collections',
        args: {
          status: {
            type: GraphQLString,
            defaultValue: 'any',
          },
          ...connectionArgs,
        },
        resolve: (obj,
            {status, ...args},
            context,
            {rootValue: objectManager}
          ) => {
              //console.log( "Root", obj, "Status", status, "Args", args, "Context", context);
              return connectionFromArray(
                  Bucket.collections.map((collection) => collection),
                  args
              )
            },
      }
  }),
  interfaces: [nodeInterface],
});

var bucketType = new GraphQLObjectType({
  name: 'Bucket',
  description: 'A person who uses our app',
  fields: () => ({
      id: globalIdField('User'),
      collections: {
        type: collectionConnection,
        description: 'A bucket\'s collections',
        args: connectionArgs,
        resolve: (_, args) => connectionFromArray(Bucket.collections, args),
      },
  }),
  interfaces: [nodeInterface],
});


let getAllCollections = () => { return Bucket.collections };
/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    bucket: {
      type: bucketType,
      resolve: () => getViewer(),
    },
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
  }),
});

function addCollection(values){
    var collectionId = Bucket.collections.push(values)  - 1;
    return { collectionId };
}
const collectionAddMutation = mutationWithClientMutationId({
  name: 'InsertCollection',
  inputFields: {
    title: {
      type: new GraphQLNonNull(GraphQLString)
    },
  },
  outputFields: {
    collection: {
      type: collectionType,
      resolve: payload => Bucket.collections[payload.collectionId],
    }
  },
  mutateAndGetPayload: (args) => {
    return addCollection(args);
  }
});

var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    insertCollection: collectionAddMutation,
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  mutation: mutationType
});
