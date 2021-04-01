// // {/* <div className="row" style={{ paddingLeft : 15, paddingRight : 2 }}>
// //                                     <div className="col-md-11">
// //                                         <div className="row flex-nowarp">
// //                                             <Textbox  withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="Color" label="Color" required="false"></Textbox>
// //                                             <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size1" label="Size1" required="false"></Textbox>
// //                                             <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size2" label="Size2" required="false"></Textbox>
// //                                             <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size3" label="Size3" required="false"></Textbox>
// //                                             <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size4" label="Size4" required="false"></Textbox>
// //                                             <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size5" label="Size5" required="false"></Textbox>
// //                                             <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size6" label="Size6" required="false"></Textbox>
// //                                             <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size7" label="Size7" required="false"></Textbox>
// //                                             <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size8" label="Size8" required="false"></Textbox>
// //                                             <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Size9" label="Size9" required="false"></Textbox>
// //                                             <Textbox withoutMargin showLabel={false} className="col-md-1" disabled defaultValue="Qty" label="Qty" required="false"></Textbox>
                                            
// //                                         </div>
// //                                     </div>
// //                                     <div className="col-md-1">
// //                                         <Button type="primary" onClick={this.addJobwork_inward_inventory} style={{ marginLeft : 10 }}> <FontAwesomeIcon  icon={faPlus} />  </Button>
// //                                     </div>
// //                                 </div>
// //          <Form.List name="jobwork_inward_inventory">
// //          { (fields, { add, remove } )=> (
// //              fields.map((field, index) => (
// //                      <div className="row" key={field.key} style={{ paddingLeft : 15, paddingRight : 2 }}>
// //                          <div className="col-md-11">
// //                              <div className="row flex-nowarp">

                               
                                 
// //                                  <Selectbox noPlaceholder withoutMargin showLabel={false} required="false" className="col-md-2" field={field} fieldKey={[ field.fieldKey, 'color_id' ]} modelName={[field.name, 'color_id']} value={field.color_id} options={this.state.color} label="Color"></Selectbox>
// //                                  {/* <Textbox noPlaceholder withoutMargin showLabel={false} className="col-md-2" field={field} fieldKey={[ field.fieldKey, 'color' ]} required="false" modelName={[field.name, 'color']} value={field.color} label="Color_id"></Textbox> */}

// //                                  <Textbox noPlaceholder withoutMargin showLabel={false} className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'size1' ]} required="false" onChange={ (ev) => this.setQTYCOLOR(ev, field.fieldKey) } modelName={[field.name, 'size1']} value={field.size1} label="Size1"></Textbox>

// //                                  <Textbox noPlaceholder withoutMargin showLabel={false} className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'size2' ]} required="false" onChange={ (ev) => this.setQTYCOLOR(ev, field.fieldKey) }  modelName={[field.name, 'size2']} value={field.size2} label="Size2"></Textbox>

// //                                  <Textbox noPlaceholder withoutMargin showLabel={false} className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'size3' ]} required="false" onChange={ (ev) => this.setQTYCOLOR(ev, field.fieldKey) }  modelName={[field.name, 'size3']} value={field.size3} label="Size3"></Textbox>

// //                                  <Textbox noPlaceholder withoutMargin showLabel={false} className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'size4' ]} required="false" onChange={ (ev) => this.setQTYCOLOR(ev, field.fieldKey) }  modelName={[field.name, 'size4']} value={field.size4} label="Size4"></Textbox>

// //                                  <Textbox noPlaceholder withoutMargin showLabel={false} className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'size5' ]} required="false" onChange={ (ev) => this.setQTYCOLOR(ev, field.fieldKey) }  modelName={[field.name, 'size5']} value={field.size5} label="Size5"></Textbox>

// //                                  <Textbox noPlaceholder withoutMargin showLabel={false} className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'size6' ]} required="false" onChange={ (ev) => this.setQTYCOLOR(ev, field.fieldKey) }  modelName={[field.name, 'size6']} value={field.size6} label="Size6"></Textbox>

// //                                  <Textbox noPlaceholder withoutMargin showLabel={false} className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'size7' ]} required="false" onChange={ (ev) => this.setQTYCOLOR(ev, field.fieldKey) }  modelName={[field.name, 'size7']} value={field.size7} label="Size7"></Textbox>

// //                                  <Textbox noPlaceholder withoutMargin showLabel={false} className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'size8' ]} required="false" onChange={ (ev) => this.setQTYCOLOR(ev, field.fieldKey) }  modelName={[field.name, 'size8']} value={field.size8} label="Size8"></Textbox>

// //                                  <Textbox noPlaceholder withoutMargin showLabel={false} className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'size9' ]} required="false" onChange={ (ev) => this.setQTYCOLOR(ev, field.fieldKey) } modelName={[field.name, 'size9']} value={field.size9} label="Size9"></Textbox>

// //                                  <Textbox noPlaceholder withoutMargin showLabel={false} disabled className="col-md-1" field={field} fieldKey={[ field.fieldKey, 'qty' ]} required="false"  modelName={[field.name, 'qty']} value={field.qty} label="Qty"></Textbox>

                                 

// //                              </div>
// //                          </div>
// //                          <div className="col-md-1">
// //                          { index > 0 && <Button danger  style={{ marginLeft : 10 }} onClick={ () => this.removeJobwork_inward_inventory(index)}> <FontAwesomeIcon  icon={faTimes} />   </Button>}
// //                          </div>
// //                       </div>
// //           )
                 
// //           )
// //       ) }
// //      </Form.List> 
// /// <div className="row" style={{ paddingLeft : 15, paddingRight : 2 }}>
// <div className="col-md-11">
// <div className="row flex-nowarp">
//     <div className="col-md-0"></div>
//     <Textbox withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="Total" label="Total" required="false"></Textbox>
//     {/* <Textbox withoutMargin showLabel={false} className="col-md-2" disabled defaultValue="Qty Bags" label="Qty Bags" required="false"></Textbox> */}
//     {/* <Textbox noPlaceholder modelName="inventory_qty_bag_total" withoutMargin showLabel={false} className="col-md-2" disabled value={this.state.formData.inventory_qty_bag_total} 
//      label="Total Qty Bags" required="false"></Textbox> */}
//     <Textbox noPlaceholder modelName="size1_total" withoutMargin showLabel={false} className="col-md-1" disabled value={this.state.formData.size1_total} label="Size1" required="false"></Textbox>
//     <Textbox noPlaceholder modelName="size2_total" withoutMargin showLabel={false} className="col-md-1" disabled value={this.state.formData.size2_total} label="Size2" required="false"></Textbox>
//     <Textbox noPlaceholder modelName="size3_total" withoutMargin showLabel={false} className="col-md-1" disabled value={this.state.formData.size3_total} label="Size3" required="false"></Textbox>
//     <Textbox noPlaceholder modelName="size4_total" withoutMargin showLabel={false} className="col-md-1" disabled value={this.state.formData.size4_total} label="Size4" required="false"></Textbox>
//     <Textbox noPlaceholder modelName="size5_total" withoutMargin showLabel={false} className="col-md-1" disabled value={this.state.formData.size5_total} label="Size5" required="false"></Textbox>
//     <Textbox noPlaceholder modelName="size6_total" withoutMargin showLabel={false} className="col-md-1" disabled value={this.state.formData.size6_total} label="Size6" required="false"></Textbox>
//     <Textbox noPlaceholder modelName="size7_total" withoutMargin showLabel={false} className="col-md-1" disabled value={this.state.formData.size7_total} label="Size7" required="false"></Textbox>
//     <Textbox noPlaceholder modelName="size8_total" withoutMargin showLabel={false} className="col-md-1" disabled value={this.state.formData.size8_total} label="Size8" required="false"></Textbox>
//     <Textbox noPlaceholder modelName="size9_total" withoutMargin showLabel={false} className="col-md-1" disabled value={this.state.formData._total} label="Size9" required="false"></Textbox>
//     <Textbox noPlaceholder modelName="inventory_qty_total" withoutMargin showLabel={false} className="col-md-1" disabled value={this.state.formData.inventory_qty_total} label="Qty" required="false"></Textbox>
// </div>
// </div>
// </div>///