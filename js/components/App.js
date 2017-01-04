import React, {Component} from 'react';
import Relay from 'react-relay';
import {SchemaForm} from 'react-schema-form';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';

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
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';

import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';

import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionReorder from 'material-ui/svg-icons/action/reorder';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

class FieldDialog extends Component {
    static defaultProps = {
        label: "",
        multiLine: false,
        optionType: "",
        options: [],
        fieldType: "input-field",
        dialogOpen: false,
    }

    static propTypes = {
        fieldType: React.PropTypes.string.isRequired,
        dialogOpen: React.PropTypes.bool.isRequired,
    }

    state = {
        label: "No Title",
        multiLine: false,
        optionType: "",
        options: ["Option 1"]
    };

    submitValue = () => {
        this.props.addField({...this.state});

        //Initialize again after submit
        this.setState({
            label: "No Title",
            multiLine: false,
            optionType: "",
            options: ["Option 1"]
        });
    }
    render() {
        const fi = (fields, fieldType) => this.props.fieldType === fieldType ? fields : null;
        const actions = [<FlatButton label = "Cancel" primary = {true} onTouchTap = {this.props.handleClose} />,
                        <FlatButton label = "Submit" primary = {true} keyboardFocused={true} onTouchTap = {this.submitValue} />];

        let updateOptions = (newValue, index) => {
            let temp = this.state.options;
            temp[index] = newValue;
            this.setState({options: temp});
        }

        return (
            <Dialog title="Edit question_1"
                    actions={actions}
                    autoScrollBodyContent={true}
                    modal={false}
                    open={this.props.dialogOpen}
                    onRequestClose={this.handleClose}>

                <TextField defaultValue={this.props.label}
                            floatingLabelText="Label"
                            onChange={(event, newValue) => this.setState({label: newValue}) }/>&nbsp;&nbsp;&nbsp;
                { fi(<TextField defaultValue="" floatingLabelText="Example Value"/>, "input-field") }
                <Checkbox label="Required"/>
                { fi(<Checkbox label="Multiple Lines"
                                checked={this.props.multiLine}
                                onCheck={(event, isInputChecked) => this.setState({multiLine: isInputChecked}) }/>, "input-field") }
                { fi(<SelectField
                          floatingLabelText="Options Type"
                          value={this.props.optionType}
                          onChange={(event, key, payload) => this.setState({optionType: payload}) }
                        >
                          <MenuItem value="select" primaryText="Select" />
                          <MenuItem value="radio" primaryText="Radio" />
                          <MenuItem value="checkbox" primaryText="Checkbox" />
                      </SelectField>, "options-field") }
                { fi(
                <div>
                    { this.state.options.map((option, i) =>
                        <span key={i}>
                            <TextField
                                    defaultValue={option}
                                    id={`${i}`}
                                    onChange={(event, newValue) => updateOptions(newValue, i)} />&nbsp;
                        </span>) }
                    <br/>
                    <FloatingActionButton
                        onClick={() => { this.setState({options: this.state.options.concat( "Option " + (this.state.options.length + 1) )}) } }
                        mini={true}
                        secondary={true}><ContentAdd/></FloatingActionButton>
                </div>, "options-field") }
            </Dialog>
        );
    }
}

const DragHandle = SortableHandle(() => <ActionReorder color={grey400} />); // This can be any component you want

const DisplayField = ({index, fieldProps}) => {
    if( fieldProps.optionType !== "" ) {
        return (<SelectField floatingLabelText={fieldProps.label}>
             { fieldProps.options.map((option, i) => <MenuItem key={i} value={i} primaryText={option} />) }
         </SelectField>);
    } else {
        return (<TextField defaultValue="" floatingLabelText={fieldProps.label} multiLine={fieldProps.multiLine}/>);
    }
}

const SortableItem = SortableElement(({index, value, handleOpen}) => {
    const iconButtonElement = (
        <IconButton touch={true} tooltip="more" tooltipPosition="bottom-left">
            <MoreVertIcon color={grey400}/>
        </IconButton>
    );

    const dialogOpen = (event) => handleOpen(event, "input-field");

    const rightIconMenu = (
        <IconMenu iconButtonElement={iconButtonElement}>
            <MenuItem onTouchTap={dialogOpen}>Edit</MenuItem>
            <MenuItem>Delete</MenuItem>
        </IconMenu>
    );

    return (
            <ListItem key={index}
                    rightIconButton={rightIconMenu}
                    disabled={true}
                    style={{ border: "1px solid #E0E0E0", margin: "10px 0"}}>
                    <DragHandle /> &nbsp;&nbsp;
                    <DisplayField fieldProps={value} index={index}/>
            </ListItem>
    );
});

const SortableList = SortableContainer(({items, handleOpen}) => {
    return (
        <List>
            {items.map((value, index) =>
                <SortableItem key={`item-${index}`} index={index} value={value} handleOpen={handleOpen} />
            )}
        </List>
    );
});

class App extends Component {
    state = {
        dialogOpen: false,
        fieldProps: {
                    fieldType: "input-field",
                    label: "",
                    multiLine: false,
                    optionType: "",
                    options: []
                },
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

    addField = (fieldProps) => {
        this.state.fields.push({...this.state.fieldProps, ...fieldProps});
        console.log("Fields:", this.state.fields);
        this.setState({ fieldProps })
        this.handleClose();
    };
    handleClose = () => {
        this.setState({dialogOpen: false});
    };
    handleOpen = (event, child) => {
        this.setState({fieldProps: {fieldType: child.ref}, dialogOpen: true});
    };
    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState({
            fields: arrayMove(this.state.fields, oldIndex, newIndex)
        });
    };

    render() {
        let _onModelChange = function(key, val) {}

        return (
            <div>
                <FieldDialog
                            dialogOpen={this.state.dialogOpen}
                            addField={this.addField}
                            handleClose={this.handleClose}
                            {...this.state.fieldProps}
                        />

                <IconMenu iconButtonElement={<FloatingActionButton mini={true} secondary={true}><ContentAdd/></FloatingActionButton>}
                        anchorOrigin={{ horizontal: 'left', vertical: 'top'}}
                        targetOrigin={{ horizontal: 'left', vertical: 'top'}}
                        onItemTouchTap={this.handleOpen}
                        style={{float: "right"}}>
                    <MenuItem primaryText="Input Text" ref="input-field"/>
                    <MenuItem primaryText="Options List" ref="options-field"/>
                    <MenuItem primaryText="Date" ref="date-field"/>
                    <MenuItem primaryText="File Attachment" ref="file-field"/>
                </IconMenu>

                <TextField id="formName" defaultValue="Untitled form"/>
                <br/>

                <SortableList handleOpen={this.handleOpen} items={this.state.fields} onSortEnd={this.onSortEnd} useDragHandle={true}/>

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
