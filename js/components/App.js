import React from 'react';
import Relay from 'react-relay';
import { SchemaForm } from 'react-schema-form';

class App extends React.Component {
  props: {
  };

  render() {
    let _onModelChange = function(key, val) {
        //console.log(key, val);
    }
    const form = [
                  "title",
                  {
                    "key": "form",
                    "type": "textarea",
                    "placeholder": "Add a form content"
                  },
                  {
                    "key": "fschema",
                    "type": "textarea",
                    "placeholder": "Add a schema content"
                  }
                ]

    const schema = {
                      "type": "object",
                      "title": "Form Data",
                      "properties": {
                        "title": {
                          "title": "Title",
                          "type": "string",
                        },
                        "form": {
                          "title": "Form",
                          "type": "string",
                          "maxLength": 20,
                          "validationMessage": "Don't be greedy! 20 Characters max please :)",
                          "description": "Please write your form here."
                        },
                        "fschema": {
                          "title": "Schema",
                          "type": "string",
                          "maxLength": 20,
                          "validationMessage": "Don't be greedy! 20 Characters max please :)",
                          "description": "Please write your schema here."
                        }
                      },
                      "required": [
                        "title",
                        "form",
                        "fschema"
                      ]
                    }

    return (
      <div>
            <h2>Form Preview</h2>
            {this.props.bucket.collections.edges.map((edge, i) =>
              <SchemaForm
                        key={i}
                        id={`title-${i}`}
                        schema={ JSON.parse( edge.node.fschema ) }
                        form={ JSON.parse( edge.node.form ) }
                        model={ JSON.parse( edge.node.model ) }
                        onModelChange={_onModelChange} />
            )}
            <br/><br/>
            <h2>Form Content</h2>

            {this.props.bucket.collections.edges.map((edge, i) =>
                <SchemaForm
                      key={i}
                      id={`title-${i}`}
                      schema={ schema }
                      form={ form }
                      model={ {"title": edge.node.title, "form": edge.node.form, "fschema": edge.node.fschema} }
                      onModelChange={_onModelChange} />
                )}
        <br/><br/>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    bucket: () => Relay.QL`
      fragment on Bucket {
        collections(first: 1) {
          edges {
            node {
              id,
              title,
              form,
              fschema,
              model,
            },
          },
        },
      }
    `,
  },
});
