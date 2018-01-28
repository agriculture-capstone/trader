import * as React from 'react';
import { List, ListItem, Text, Grid, Col, Card } from 'native-base';
import styles from './style';
import { Route } from '../../navigation/navigator';


/** Interface for clickable list item support */
interface RoutedPropsType {
  route: Route;
  onPress(route: Route): void;
}

interface OwnPropsType {
  headers: string[];
  values: any[];
  RoutedPropsType?: any;
}

interface DispatchPropsType {

}

interface StorePropsType {

}

type PropsType = OwnPropsType & DispatchPropsType & StorePropsType;

interface OwnStateType {

}

/**
* Component for DataTable
*/
export default class DataTable extends React.Component<PropsType, OwnStateType> {
  constructor(props: PropsType) {
    super(props);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  private onPress = () => {
    if (this.props.RoutedPropsType) {
      this.props.RoutedPropsType.onPress(this.props.RoutedPropsType.route);
    }
  }

  private formatValues(values: any[]) {
    return values.map((value) => {
      return (
        <Col key={value} style={{ justifyContent: 'center' }}>
          <Text style={styles.values}>
            {value}
          </Text>
        </Col>
      );
    });
  }
  
  private renderRow(item: any) {
    return (
      <ListItem style={{ justifyContent: 'center' }} button onPress={this.onPress}>
        <Grid style={{ justifyContent: 'center' }}>
          {this.formatValues(Object.values(item))}
        </Grid>
      </ListItem>
    );
  }

  private renderSectionHeader() {
    return (
      <ListItem itemHeader first>
        <Grid>
          {this.formatValues(this.props.headers)}
        </Grid>
      </ListItem>
    );
  }

  /**
  * Render method for DataTable
  */
  public render() {
    return (
      <Card>
      <List
        dataArray={this.props.values}
        renderRow={this.renderRow}
        renderSectionHeader={this.renderSectionHeader}
      />
      </Card>
    );
  }
}
