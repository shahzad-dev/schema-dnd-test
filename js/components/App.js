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
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';

import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionReorder from 'material-ui/svg-icons/action/reorder';
import ActionSwapVerticalCircle from 'material-ui/svg-icons/action/swap-vertical-circle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

class FieldDialog extends Component {
    static defaultProps = {
        fieldProps: {
            fieldType: "input-field",
            fid: null,
            label: "",
            multiLine: false,
            optionType: "",
            options: [],
        },
        dialogOpen: false,
    }

    static propTypes = {
    }

    state = {
        fieldType: "input-field",
        fid: null,
        label: "",
        multiLine: false,
        optionType: "",
        options: [],
    };

    resetValues() {
        this.setState({
            fieldType: "input-field",
            fid: null,
            label: "",
            multiLine: false,
            optionType: "",
            options: [],
        });
    }

    submitValue = () => {
        //Pass back to parent with submit values
        this.props.addField(this.state);
        this.resetValues();
    }
    componentWillReceiveProps(nextProps) {
        console.log("Received Props", nextProps, this.state);
        if( nextProps.dialogOpen ) {
            console.log("Initialize");
            this.setState({ ...this.state, ...nextProps.fieldProps});
            console.log("State: ", this.state);
        } else {
            console.log("Reset");
            this.resetValues();
        }
    }
    render() {
        const fi = (fields, fieldType) => this.props.fieldProps.fieldType === fieldType ? fields : null;
        const actions = [<FlatButton label = "Cancel" primary = {true} onTouchTap = {this.props.handleClose} />,
                        <FlatButton label = "Submit" primary = {true} keyboardFocused={true} onTouchTap = {this.submitValue} />];
        let options =  this.state.options ? this.state.options : [];
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

                <TextField defaultValue={this.state.label}
                            floatingLabelText="Label"
                            onChange={(event, newValue) => this.setState({label: newValue}) }/>&nbsp;&nbsp;&nbsp;
                { fi(<TextField defaultValue="" floatingLabelText="Example Value"/>, "input-field") }
                <Checkbox label="Required"/>
                { fi(<Checkbox label="Multiple Lines"
                                defaultChecked={this.props.fieldProps.multiLine}
                                onCheck={(event, isInputChecked) => this.setState({multiLine: isInputChecked}) }/>, "input-field") }
                { fi(<SelectField
                          floatingLabelText="Options Type"
                          value={this.state.optionType}
                          onChange={(event, key, payload) => this.setState({optionType: payload}) }
                        >
                          <MenuItem value="select" primaryText="Select" />
                          <MenuItem value="radio" primaryText="Radio" />
                          <MenuItem value="checkbox" primaryText="Checkbox" />
                      </SelectField>, "options-field") }
                { fi(
                <div>
                    {options.map((option, i) =>
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

const DragHandle = SortableHandle(() => <ActionSwapVerticalCircle color={grey400} />); // This can be any component you want

const DisplayField = ({index, fieldProps}) => {
    if( fieldProps.fieldType === "options-field" && fieldProps.optionType === "select") {
        return (<SelectField floatingLabelText={fieldProps.label}>
             { fieldProps.options.map((option, i) => <MenuItem key={i} value={i} primaryText={option} />) }
         </SelectField>);
    } else if( fieldProps.fieldType === "options-field" && fieldProps.optionType === "checkbox" ) {
        return (<div>
             { fieldProps.options.map((option, i) => <Checkbox key={i} label={option} />) }
         </div>);
    } else if( fieldProps.fieldType === "options-field" && fieldProps.optionType === "radio" ) {
        return (<RadioButtonGroup name={fieldProps.label.toLowerCase()}>
             { fieldProps.options.map((option, i) => <RadioButton key={i} value={i} label={option} />) }
         </RadioButtonGroup>);
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

    const dialogOpen = (event) => handleOpen(event, value);

    const rightIconMenu = (<IconMenu iconButtonElement={iconButtonElement}>
                                <MenuItem onTouchTap={dialogOpen}>Edit</MenuItem>
                                <MenuItem>Delete</MenuItem>
                            </IconMenu>);

    return (
            <ListItem key={index}
                    rightIconButton={rightIconMenu}
                    disabled={true}
                    style={{ border: "1px solid #E0E0E0", margin: "10px 0"}}>
                    <div style={{ display: "inline-block", width: "100%"}}>
                        <div style={{float:"left", width: "5%", margin: "2% auto"}}>
                            <DragHandle /> &nbsp;&nbsp;
                        </div>
                        <div style={{"float":"left", width: "95%"}}>
                            <DisplayField fieldProps={value} index={index}/>
                        </div>
                    </div>
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
        fieldProps: {},
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
        console.log("Add Fields", fieldProps);

        if( this.state.fieldProps.fid > -1 ) {
            let temp = this.state.fields;
            temp[this.state.fieldProps.fid] = {...this.state.fieldProps, ...fieldProps};
            this.setState({fields: temp});
        } else {
            let fid = this.state.fields.length;
            console.log(this.state.fieldProps);
            this.state.fields.push({...this.state.fieldProps, ...fieldProps, fid});
        }
        console.log("Fields:", this.state.fields);
        this.handleClose();
    };
    handleClose = () => {
        this.setState({fieldProps: {}, dialogOpen: false});
    };
    handleOpen = (event, child) => {
        if( child.ref ) {
            //new mode
            this.setState({fieldProps: {fieldType: child.ref}, dialogOpen: true});
            console.log("Parent State", this.state);
        } else {
            //merge field id and other props
            //edit mode
            this.setState({fieldProps: child, dialogOpen: true});
        }
        // console.log(this.state.fieldProps);
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
                            fieldProps={this.state.fieldProps}
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
