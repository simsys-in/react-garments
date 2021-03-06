import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Form, Input, Select } from 'antd'
import { checkBoolean, issetNotEmpty } from '../../helpers/formhelpers';

const { Option } = Select;

const selectOptions = [
    {
        name : 'Active',
        value : 1,
    },
    {
        name : 'Inactive',
        value : 0,
    }
]


class Selectbox extends PureComponent {
    formRef = React.createRef();
    constructor(props){
        super(props);
        this.state ={}
    }



    render(){
        const options = this.props.statusSelect ? selectOptions : this.props.options;
        const showLabel = issetNotEmpty(this.props.showLabel) ? this.props.showLabel : true;
        return(
            
            <div className={ this.props.className ? this.props.className : 'col-md-4' } style={{ padding : this.props.withoutMargin ? '0' : 'auto', bottom : this.props.withoutMargin ? '-15px' : 'auto' ,top : this.props.withoutMargin ? '0' : 'auto', right : this.props.withoutMargin ? '0' : 'auto', left : this.props.withoutMargin ? '0' : 'auto' }} >
                <Input.Group compact >
                    
                        { showLabel ? 
                            <Form.Item
                            validateStatus={ this.props.value !== "" || !checkBoolean(this.props.required, true) ? "success" : "error" }
                            help={ this.props.value !== "" || !checkBoolean(this.props.required, true) || this.props.withoutMargin ? "" : "  Please  Select " } >
                                <Input disabled className="no-border select-search" value={ this.props.label } style={{ color: this.props.value !== "" || !checkBoolean(this.props.required, true) ? 'rgba(0, 0, 0, 0.65)' : 'red', cursor: 'auto' }} />
                            </Form.Item>
                        : null}
                        <Form.Item
                            className={ showLabel ? "compound-select" : "select"}
                            name={this.props.modelName}
                            validateStatus={ this.props.value !== "" || !checkBoolean(this.props.required, true) ? "success" : "error" }
                            help={ this.props.value !== "" || !checkBoolean(this.props.required, true) || this.props.withoutMargin ? null :  this.props.label }
                            rules={[
                            {
                                required: checkBoolean(this.props.required, true),
                                message: ' ',
                            },
                            ]}
                        >
                            <Select
                                mode={ checkBoolean(this.props.multiple) ? "multiple" : '' }
                                showSearch
                                autoFocus={ checkBoolean(this.props.autoFocus) }
                                name={ this.props.modelName }
                                id={ this.props.modelName }
                                placeholder={ this.props.noPlaceholder ? "" : "Select " + this.props.label}
                                optionFilterProp="children"
                                disabled={ this.props.disabled }
                                onChange={ this.props.onChange }
                                filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                { options.map((option, index) => 
                                    <Option value={ option.value } key={index} >{ option.name }</Option>
                                )}
                            </Select>
                        </Form.Item>
                </Input.Group>
            </div>
        )
    }
}

export default withRouter(Selectbox);