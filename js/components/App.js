import React from 'react';
import Relay from 'react-relay';
import {SchemaForm} from 'react-schema-form';

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';

import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';

import Dialog from 'material-ui/Dialog';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';

import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';

import ContentAdd from 'material-ui/svg-icons/content/add';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

class FieldDialog extends React.Component {
    static defaultProps = {
        dialogType: "input-field",
        dialogOpen: false
    }

    static propTypes = {
        dialogType: React.PropTypes.string.isRequired,
        dialogOpen: React.PropTypes.bool.isRequired
    }

    state = {};

    render() {
        const fi = (fields, fieldType) => this.props.dialogType === fieldType
            ? fields
            : null;
        const actions = [ < FlatButton label = "Cancel" primary = {
                true
            }
            onTouchTap = {
                this.props.handleClose
            } />, < FlatButton label = "Submit" primary = {
                true
            }
            keyboardFocused = {
                true
            }
            onTouchTap = {
                this.props.addField
            } />
        ];

        return (
            <Dialog title="Edit question_1" actions={actions} modal={false} open={this.props.dialogOpen} onRequestClose={this.handleClose}>
                <TextField defaultValue="Question 3" floatingLabelText="Label"/>&nbsp;&nbsp;&nbsp; {fi(
                    <TextField defaultValue="" floatingLabelText="Example Value"/>, "input-field")}<br/>
                <br/>
                <Checkbox label="Required"/> {fi(
                    <Checkbox label="Multiple Lines"/>, "input-field")}
            </Dialog>
        );
    }
}

class App extends React.Component {
    state = {
        dialogOpen: false,
        dialogType: "input-field",
        fields: [],
        form: ["*"],
        schema: {
            "type": "object",
            "title": "Form Data",
            "properties": {
                "title": {
                    "title": "Title",
                    "type": "string"
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
            "required": []
        }
    };

    //this.setState({ schema.properties["new_fild"]: {} });

    addField = () => {
        console.log("Field Added...");
        this.state.fields.push(<TextField defaultValue="Question 3" floatingLabelText="Label"/>)
        this.handleClose();
    };
    handleClose = () => {
        this.setState({dialogOpen: false});
    };
    handleOpen = (event, child) => {
        this.setState({dialogType: child.ref, dialogOpen: true});
    };

    render() {
        let _onModelChange = function(key, val) {}
        const iconButtonElement = (
            <IconButton touch={true} tooltip="more" tooltipPosition="bottom-left">
                <MoreVertIcon color={grey400}/>
            </IconButton>
        );

        const rightIconMenu = (
            <IconMenu iconButtonElement={iconButtonElement}>
                <MenuItem>Edit</MenuItem>
                <MenuItem>Move</MenuItem>
                <MenuItem>Delete</MenuItem>
            </IconMenu>
        );

        const fieldRender = (field, index) => {
            return (
                <ListItem key={index} rightIconButton={rightIconMenu} disabled={true} style={{
                    border: "1px solid #E0E0E0",
                    margin: "10px 0"
                }}>
                    {field}
                </ListItem>
            );
        }
        return (
            <div>
                <FieldDialog dialogType={this.state.dialogType} dialogOpen={this.state.dialogOpen} addField={this.addField} handleClose={this.handleClose}/>

                <IconMenu iconButtonElement={< FloatingActionButton mini = {
                    true
                }
                secondary = {
                    true
                } > <ContentAdd/> < /FloatingActionButton>} anchorOrigin={{
                    horizontal: 'left',
                    vertical: 'top'
                }} targetOrigin={{
                    horizontal: 'left',
                    vertical: 'top'
                }} onItemTouchTap={this.handleOpen} style={{
                    float: "right"
                }}>
                    <MenuItem primaryText="Input Text" ref="input-field"/>
                    <MenuItem primaryText="Options List" ref="options-field"/>
                    <MenuItem primaryText="Date" ref="date-field"/>
                    <MenuItem primaryText="File Attachment" ref="file-field"/>
                </IconMenu>

                <TextField id="formName" defaultValue="Untitled form"/>
                <br/>

                <List>
                    <br/> {this.state.fields.map((field, index) => fieldRender(field, index))
}
                </List>

                <br/><br/> {/* <h1>Preview</h1>
                <SchemaForm
                  schema={ this.state.schema }
                  form={ this.state.form }
                  model={ {} }
                  onModelChange={_onModelChange} /> */}
            </div>
        );
    }
}

export default Relay.createContainer(App, {
    fragments: {
        bucket: () => Relay.QL `
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
    `
    }
});
