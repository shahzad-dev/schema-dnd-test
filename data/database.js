/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// Model types
class User {}
class Widget {}
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
              },
            },
      model: {}
  }
var Bucket = {
    collections: [
      { id:"1",
        title:"Form1",
        form: JSON.stringify(formDummy.form),
        schema: JSON.stringify(formDummy.schema) }
    ],
    records: [
      { title:"Cricket" },
      { title: "Reading" },
      { title: "Traveling" }
    ]
}

// Mock data
var viewer = new User();
viewer.id = '1';
viewer.name = 'Anonymous';
var widgets = ['What\'s-it', 'Who\'s-it', 'How\'s-it'].map((name, i) => {
  var widget = new Widget();
  widget.name = name;
  widget.id = `${i}`;
  return widget;
});

module.exports = {
  // Export methods that your schema can use to interact with your database
  getUser: (id) => id === viewer.id ? viewer : null,
  getViewer: () => viewer,
  getWidget: (id) => widgets.find(w => w.id === id),
  getWidgets: () => widgets,
  getCollections: () => { return Bucket.collections },
  getRecords: () => ( Bucket.records ),
  User,
  Widget,
  Bucket
};
