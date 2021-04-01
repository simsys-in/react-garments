import React, { Fragment, PureComponent } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

class Sample extends PureComponent {
    constructor(props){
        super(props);
        this.state ={}
    }

    componentDidMount = () => {
        console.log("Sample Rendered")
    }

    render(){
        return(
            <Fragment>

            </Fragment>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        store: state
    }
}

const mapDispatchToProps = {
  }
  


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Sample));
