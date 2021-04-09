import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Form, Input } from 'antd'
import { checkBoolean, issetNotEmpty } from '../../helpers/formhelpers';

class Timepicker extends PureComponent {
    constructor(props){
        super(props);
        this.state ={}
    }

    render(){
        const showLabel = issetNotEmpty(this.props.showLabel) ? this.props.showLabel : true;
        return(
            <Form.Item
            className={ this.props.className ? this.props.className : 'col-md-4' }
            style={{ padding : this.props.withoutMargin ? '0' : 'auto', bottom : this.props.withoutMargin ? '0' : 'auto' ,top : this.props.withoutMargin ? '0' : 'auto', right : this.props.withoutMargin ? '0' : 'auto', left : this.props.withoutMargin ? '0' : 'auto' }}
            name={this.props.modelName}
            rules={[
            {
                required: checkBoolean(this.props.required, true),
                message: 'Please input ' + this.props.label + "!",
            },
            ]}
        >
            <Input type="time" addonBefore={ showLabel ? this.props.label : ''}  defaultValue={ this.props.defaultValue } disabled={ checkBoolean(this.props.disabled) } format={ this.props.format ? this.props.format : "HH:mm" }
                id={ this.props.id } maxLength={ this.props.maxLength } prefix={ this.props.prefix } size={ this.props.size } suffix={ this.props.suffix } value={ this.props.value } onPressEnter={ this.props.onPressEnter } allowClear={ checkBoolean(this.props.allowClear,true) } bordered={ checkBoolean(this.props.bordered,true) } addonAfter={this.props.addonAfter} onChange={ this.props.onChange } onBlur={ this.props.onBlur } placeholder={ "Please Enter " + this.props.label } />
        </Form.Item>
        )
    }
}

export default withRouter(Timepicker);