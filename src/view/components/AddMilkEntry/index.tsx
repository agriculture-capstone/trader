import * as React from 'react';
import { Content, List, ListItem, Text, Grid, Row, Col, H1, Button, Input, Form, Item, Label } from 'native-base';
import * as moment from 'moment';

import { Farmer } from '../../../store/modules/farmer/types';
import { MilkEntry } from '../../../store/modules/milk/types';

import { Route } from '../../navigation/routes';
import { MapStateToProps, MapDispatchToProps, connect } from 'react-redux';
import navActions from '../../../store/modules/nav/actions';
import Composer from '../../hoc/PageComposer/index';
import { State } from '../../../store/types';
import milkThunks from '../../../store/modules/milk/thunks';

import Styles from './style';
import { getActiveFarmer } from '../../../store/modules/farmer/selectors';

interface OwnPropsType {
}

interface DispatchPropsType {
  navigate(route: Route): void;
  goBack(): void;
  createMilkEntry(newEntry: MilkEntry): Promise<string>;
}

interface StorePropsType {
  farmer: Farmer;
  activeTrader: any;
  activeFarmer: any;
}

/** AddEntry PropsType */
type PropsType = StorePropsType & DispatchPropsType & OwnPropsType;

interface OwnStateType {
  amountOfProduct: number;
  quality: string;
  costPerUnit: number;
  validAmount: boolean;
  validRate: boolean;
}

/**
 * Button color
 */
type ButtonColor = 'PRIMARY' | 'INFO';

/**
 * AddEntry page
 * @example
 *             <AddEntry
 *             />
 */

class AddMilkEntry extends React.Component<PropsType, OwnStateType> {

  private numbers = /^[0-9]+$/;
  constructor(props: PropsType) {
    super(props);
    /** Init state */
    this.state = {
      amountOfProduct: 0,
      quality: '0',
      costPerUnit: 0,
      validAmount: false,
      validRate: false,
    };
  }
  /** Get current datetime in specified format */
  private getDatetime = (format: string) => moment().format(format);

  /** Create page buttons */
  private renderCancelButton = () => this.renderButton('Cancel', 'INFO', this.onCancelPress);
  private renderSaveButton = () => this.renderButton('Save', 'PRIMARY', this.onSavePress);

  /** Handle pressing cancel button */
  private onCancelPress = () => this.props.goBack();

  /** Handle pressing save button */
  private onSavePress = () => {
    // @TODO change time format to match core
    const timeNow = moment().local().utc().toString();

    let newEntry: MilkEntry = {
      type: 'milk',
      datetime: timeNow,
      toPersonUuid: this.props.activeTrader,
      fromPersonUuid: this.props.activeFarmer,
      amountOfProduct: this.state.amountOfProduct,
      costPerUnit: this.state.costPerUnit,
      currency: 'UGX',
      milkQuality: this.state.quality,
    };
    this.props.createMilkEntry(newEntry);
    this.props.navigate(Route.FARMER);
  }

  /** Return validity of required fields */
  private allValid = () => (
    this.state.validAmount
    && this.state.validRate
  )

  private onChangeAmount = (newAmount: string) => {
    const newAmountFloat = Number(newAmount);

    if (!newAmount.match(this.numbers) || newAmountFloat < 0) {
      this.setState(state => ({ validAmount: false }));
    } else {
      this.setState(state => ({ amountOfProduct: newAmountFloat, validAmount: true }));
    }
  }

  private onChangeQuality = (newQuality: string) => {
    this.setState(state => ({ quality: newQuality }));
  }

  private onChangeRate = (newRate: string) => {
    const newRateFloat = Number(newRate);

    if (!newRate.match(this.numbers) || newRateFloat < 0) {
      this.setState(state => ({ validRate: false }));
    } else {
      this.setState(state => ({ costPerUnit : newRateFloat, validRate: true }));
    }
  }

  /**
   * Returns a button with text, color, and onPress callback specified
   */
  private renderButton(text: string, color: ButtonColor, onPress: any) {
    const isInfo = color === 'INFO';
    const isPrimary = color === 'PRIMARY';

    if (isPrimary) {
      return (
        <Col style={Styles.button}>
          <Button disabled={!this.allValid()} block info={isInfo} primary={isPrimary} onPress={onPress}>
            <Text>{text}</Text>
          </Button>
        </Col>
      );
    } else {
      return (
        <Col style={Styles.button}>
          <Button block info={isInfo} primary={isPrimary} onPress={onPress}>
            <Text>{text}</Text>
          </Button>
        </Col>
      );
    }
  }

  private renderHeader() {
    return (
      <Grid>
        <Row style={Styles.headerRow}>
          <H1>
            {this.props.farmer.firstName} {this.props.farmer.lastName}
          </H1>
        </Row>
        <Row style={Styles.headerRow}>
          <Text style={Styles.header}>
            {this.getDatetime('dddd, MMMM DD, YYYY')}
          </Text>
        </Row>
        <Row style={Styles.headerRow}>
          <Text style={Styles.header}>
            {this.getDatetime('kk:mm')}
          </Text>
        </Row>
      </Grid>
    );
  }

  private renderFields() {
    return (
      <Form>
        <Item success={this.state.validAmount} error={!this.state.validAmount} floatingLabel>
          <Label>Amount (L)</Label>
          <Input onChangeText={this.onChangeAmount} keyboardType={'numeric'} />
        </Item>
        <Item floatingLabel>
          <Label>Lactometer</Label>
          <Input onChangeText={this.onChangeQuality} keyboardType={'numeric'} />
        </Item>
        <Item success={this.state.validRate} error={!this.state.validRate} floatingLabel>
          <Label>Rate (UGX/L)</Label>
          <Input onChangeText={this.onChangeRate} keyboardType={'numeric'}/>
        </Item>
      </Form>
    );
  }

  /**
   * Render method for AddEntry
   */
  public render() {
    return (
      <Content padder style={Styles.content}>
        <List>
          <ListItem>
            {this.renderHeader()}
          </ListItem>
        </List>
        {this.renderFields()}
        <Grid>
          <Row style={Styles.buttonRow}>
            {this.renderCancelButton()}
            {this.renderSaveButton()}
          </Row>
        </Grid>
      </Content>
    );
  }
}

const AddMilkEntryPage = new Composer<PropsType>(AddMilkEntry).page;

const mapStateToProps: MapStateToProps<StorePropsType, OwnPropsType, State> = (state) => {
  return {
    farmer: getActiveFarmer(state),
    activeTrader: state.activeRows.activeTraderUUID,
    activeFarmer: state.activeRows.activeFarmerUUID,
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchPropsType, OwnPropsType> = (dispatch) => {
  return {
    navigate: (route: Route) => dispatch(navActions.navigateToWithoutHistory(route)),
    goBack: () => dispatch(navActions.goBack()),
    createMilkEntry: async (newEntry: MilkEntry) => dispatch(milkThunks.createMilkEntry(newEntry)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddMilkEntryPage);
