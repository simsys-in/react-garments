import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Form, Input,DatePicker } from 'antd'
import { checkBoolean, issetNotEmpty } from '../../helpers/formhelpers';

class Datebox extends PureComponent {
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.state ={}
    }

    render(){
        const showLabel = issetNotEmpty(this.props.showLabel) ? this.props.showLabel : true;
        return(
            
            <div className={ this.props.className ? this.props.className : 'col-md-4' } style={{ padding : this.props.withoutMargin ? '0' : 'auto', bottom : this.props.withoutMargin ? '0' : 'auto' ,top : this.props.withoutMargin ? '0' : 'auto', right : this.props.withoutMargin ? '0' : 'auto', left : this.props.withoutMargin ? '0' : 'auto' }}>
                <Input.Group compact >
                    
                    { showLabel ? 
                            <Form.Item validateStatus={ this.props.value || !checkBoolean(this.props.required) ? "success" : "error" } help={ this.props.value || this.props.withoutMargin || !checkBoolean(this.props.required) ? "" : "  Please  Select " } >
                                <Input disabled className="no-border select-search" value={ this.props.label } style={{ color: this.props.value || !checkBoolean(this.props.required) ? 'rgba(0, 0, 0, 0.65)' : 'red', borderLeftColor: this.props.value || !checkBoolean(this.props.required) ? 'rgba(0, 0, 0, 0.65)' : 'red', cursor: 'auto' }} />
                            </Form.Item>
                        : null}
                        <Form.Item
                            className={ showLabel ? "compound-select" : "select"}
                            name={this.props.modelName}
                            validateStatus={ this.props.value || !checkBoolean(this.props.required) ? "success" : "error" }
                            help={ this.props.value || this.props.withoutMargin || !checkBoolean(this.props.required) ? "" :  this.props.label }
                            rules={[
                            {
                                required: checkBoolean(this.props.required, true),
                                message: ' ',
                            },
                            ]}
                        >
                            
                            <DatePicker autoFocus={ checkBoolean(this.props.autoFocus) } picker={ this.props.picker ? this.props.picker : "date" } onChange={ this.props.onChange } disabled={ checkBoolean(this.props.disabled) } selected={ this.props.value ? this.props.value : new Date() } format={ this.props.format ? this.props.format : "DD-MM-YYYY" } placeholder={ "Select " + this.props.label } />
                        </Form.Item>
                </Input.Group>
            </div>
        )
    }
}

export default withRouter(Datebox);