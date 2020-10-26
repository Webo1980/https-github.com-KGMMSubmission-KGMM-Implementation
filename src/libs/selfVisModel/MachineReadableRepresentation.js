import Cell from './Cell';

export default class MachineReadableRepresentation {
    constructor(inputData) {
        this.inputDataAsJsonObject = inputData;
        this.mrrModel = {};
    }

    execute = () => {
        // parser execution function;
        console.log('THIS IS OUR INPUT ! ', this.inputDataAsJsonObject);

        // we actually dont care about transposition >> we create it always like row based entries for a single paper.

        // our data model will hold the contributionAnchros, propertyAnchors and valueAnhors

        this.createContributionAnchors(this.mrrModel);
        this.createPropertyAnchors(this.mrrModel);
        this.createDataItemAnchors(this.mrrModel);

        // NEXT STEPS:
        // parse the dataAnchors
        // which create a label and we should be add functions to get rows and cols
        // we use a single linear array to store the cell values
        // cells will have a row and column index
        // add function : getRow(index) => filters all cells with this index
        // add function : getCol(index) => filters all cells with this index

        // this function declaration is a bit shady, but lets simply use it
        // NO: this should be handled by the model tho the data!!!!
        this.mrrModel.getRow = function(index) {
            console.log(index, 'IT WORKS', this.propertyAnchors);
        };

        console.log('-----------------\n\n-------------------');
        console.log(this.mrrModel);
        console.log('^^^^ THE OUTPUT MODEL ^^^');
        console.log('all contributions for a property', this.getCol(0));
        console.log('all properties for a contribution', this.getRow(0));
        console.log('An Item', this.getItem(1, 1));
        console.log('----------------------------');
    };

    getResult = () => {
        return this.mrrModel;
    };

    getRow = index => {
        // we use the notation, that the row describes the cell values related to the contribution anchors
        // so it will return all values for a "property" relating to all contributions
        return this.mrrModel.dataItems.filter(item => item.positionContribAnchor === index);
    };

    getCol = index => {
        // we use the notation, that the row describes the cell values related to the property anchors
        // so it will return all values for a "contribution" relating to all properties
        return this.mrrModel.dataItems.filter(item => item.positionPropertyAnchor === index);
    };
    getItem = (rowIndex, colIndex) => {
        const itemsArray = this.mrrModel.dataItems.filter(
            item => item.positionPropertyAnchor === colIndex && item.positionContribAnchor === rowIndex
        );
        if (itemsArray.length === 1) {
            return itemsArray[0];
        } else {
            return null; //<< ERROR
        }
    };

    // getPropertyAnchors = () => {
    //     // gives us the header information for the rendering
    //     return this.mrrModel.propertyAnchors;
    // };
    // getContributionAnchors = () => {
    //     // gives us the header information for the rendering
    //     return this.mrrModel.contributionAnchors;
    // };
    // getDataItems = () => {
    //     return this.mrrModel.dataItems;
    // };

    createDataItemAnchors(model) {
        this.mrrModel.dataItems = [];

        // linear storing the items;
        // got through the propertyAnchors;
        model.propertyAnchors.forEach((property, rowIndex) => {
            console.log(rowIndex, property.propertyAnchor.id);
            // get it from the input data;
            const thatData = this.inputDataAsJsonObject.data[property.propertyAnchor.id];
            if (thatData) {
                thatData.forEach((cell, colIndex) => {
                    // create a cell
                    const dataCell = new Cell();
                    dataCell.setFlagByName('value');
                    dataCell.initializeCellValueFromData(cell, rowIndex, colIndex);
                    model.dataItems.push(dataCell);
                });
            }
        });
    }

    createContributionAnchors(model) {
        // go through the input data and create the anchors for the contributions (add AnchorId)
        model.contributionAnchors = [];
        this.inputDataAsJsonObject.contributions.forEach((contrib, index) => {
            // create a cell as contributionAnchor;
            const aCell = new Cell();
            aCell.setFlagByName('contribution');
            aCell.initializeCellFromData(contrib, index);
            model.contributionAnchors.push(aCell);
        });
    }
    createPropertyAnchors(model) {
        // go through the input data and create the anchors for the contributions (add AnchorId)
        model.propertyAnchors = [];
        this.inputDataAsJsonObject.properties.forEach((property, index) => {
            console.log(property);
            // create a cell as contributionAnchor;
            const aCell = new Cell();
            aCell.setFlagByName('property');
            aCell.initializeCellFromData(property, index);
            model.propertyAnchors.push(aCell);
        });
    }
}
