import React, { PureComponent } from 'react';
import { MDBDataTableV5 } from 'mdbreact';


class DataTable extends PureComponent{
    constructor(props){
        super(props);
        this.state = {};
    }

    render(){
        return(
            // <MDBDataTableV5 striped hover scrollX scrollY maxHeight='500px' bordered small responsive data={this.props.data} />
            <div className="table-scroll" style={{ backgroundColor : 'white', padding : 10 }}>
                
            <MDBDataTableV5
                hover
                // striped scrollX scrollY maxHeight='500px' 
                // bordered
                //  small responsive
                entriesOptions={[10, 20, 50,100]}
                entries={10}
                pagesAmount={4}
                data={this.props.data}
                pagingTop
                searchTop
                searchBottom={false}
                />
                </div>

        )
    }
}

export default DataTable;
