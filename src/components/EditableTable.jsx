import React from "react";
import { Fragment } from "react";

const columns = ["Person Name", "Age", "Company Name", "Country", "City"];

const data = [
  ["Aurelia Vega", 30, "Deepends", "Spain", "Madrid"],
  ["Guerra Cortez", 45, "Insectus", "USA", "San Francisco"],
  ["Guadalupe House", 26, "Isotronic", "Germany", "Frankfurt am Main"],
  ["Elisa Gallagher", 31, "Portica", "United Kingdom", "London"]
];

const onCellChange=  function(row, column) {
    //update the cell with this.setState() method
}

const TableEditablePage = props => {
    
  return (
      <Fragment>
      </Fragment>
  );
};

export default TableEditablePage;