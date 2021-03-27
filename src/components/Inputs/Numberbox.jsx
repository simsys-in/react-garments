import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Form, Input } from 'antd'
import { checkBoolean, issetNotEmpty } from '../../helpers/formhelpers';

class Numberbox extends PureComponent {
    constructor(props){
        super(props);
        this.state ={}
    }

    render(){
        const showLabel = issetNotEmpty(this.props.showLabel) ? this.props.showLabel : true;
        return(
            <Form.Item
                name={ this.props.modelName ? this.props.modelName : 'name' }
                className={ this.props.className ? this.props.className : 'col-md-6' }
                style={{ padding : this.props.withoutMargin ? '0' : 'auto', bottom : this.props.withoutMargin ? '0' : 'auto' ,top : this.props.withoutMargin ? '0' : 'auto', right : this.props.withoutMargin ? '0' : 'auto', left : this.props.withoutMargin ? '0' : 'auto' }}
                rules={[
                    {
                        required: checkBoolean(this.props.required, true),
                        message: this.props.withoutMargin ? null : 'Please Input ' + this.props.label + '!' ,
                    },
                    // {
                    //     max: this.props.max ? this.props.max : '',
                    //     message:  this.props.label + " Should be less than or equal to 100",
                    // },
                ]}
            >
                <Input autoFocus={ checkBoolean(this.props.autoFocus) } addonBefore={ showLabel ? this.props.label : ''}  defaultValue={ this.props.defaultValue }  disabled={ checkBoolean(this.props.disabled) } max={ this.props.max }  min={ this.props.min } prefix={ this.props.prefix } size={ this.props.size } suffix={ this.props.suffix } type="number" step={ this.props.step } value={ this.props.value } onPressEnter={ this.props.onPressEnter } allowClear={ checkBoolean(this.props.allowClear) } bordered={ this.props.bordered } addonAfter={this.props.addonAfter} onChange={ this.props.onChange } onBlur={ this.props.onBlur } placeholder={ this.props.noPlaceholder ? "" : "Please Enter " + this.props.label }/>
            </Form.Item>
        )
    }
}

export default withRouter(Numberbox);