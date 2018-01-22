import * as React from 'react';

import { Content, List, ListItem } from 'native-base';
import { Text, View } from 'react-native';
import { MapStateToProps, MapDispatchToProps, connect } from 'react-redux';

import createSearchPage, { InjectedSearchProps } from '../../generators/SearchPage';
import navActions from '../../../store/modules/nav/actions';
import { Route } from '../../navigation/navigator';
import { State } from '../../../store/types';
import { styles } from './style';

/** This is just a table of phony information to populate the FarmerSearch UI */
const defaultFarmerList = [{ name: 'Swalleh', phoneNumber: '1-250-234-1234', id: 1 },
                    { name: 'James', phoneNumber: '1-526-123-8123', id: 2 },
                    { name: 'Alex', phoneNumber: '1-514-235-6789', id: 3 },
                    { name: 'Joseph', phoneNumber: '1-922-789-2348', id: 4 },
                    { name: 'Mary', phoneNumber: '1-626-626-1236', id: 5 },
                    { name: 'David', phoneNumber: '1-789-231-2345', id: 6 },
                    { name: 'Michael', phoneNumber: '1-899-781-8786', id: 7 },
                    { name: 'Mary', phoneNumber: '1-897-768-6780', id: 8 },
                    { name: 'Peter', phoneNumber: '1-123-564-2315', id: 9 },
                    { name: 'Jonah', phoneNumber: '1-011-101-1001', id: 10 },
                    { name: 'Simon', phoneNumber: '1-234-456-7890', id: 11 }];

/** Basic model for the FarmerType object */
interface FarmerType {
  name: string;
  phoneNumber: string;
  id: number;
}

/** FarmerSearch OwnPropsType */
export interface OwnPropsType {
  listItems?: FarmerType[];
}

/** FarmerSearch StorePropsType */
interface StorePropsType {}

/** FarmerSearch DispatchPropsType */
interface DispatchPropsType {
  navigateToFarmer(): void;
}

type FarmerSearchPropsType = StorePropsType & DispatchPropsType & OwnPropsType;

/** FarmerSearch Props */
type Props = FarmerSearchPropsType & InjectedSearchProps;

/** Farmer Search component for displaying and searching through farmers */
class FarmerSearch extends React.Component<Props, {}> {

    public static defaultProps = {
        listItems: defaultFarmerList,
    };

    /************************* Member Variables ************************/


    /************************* Member Functions ************************/

    public constructor(props: Props) {
        super(props);

        this.renderItem = this.renderItem.bind(this);
        this.itemClicked = this.itemClicked.bind(this);
    }

    /** Function to take user to farmer that was clicked on */
    private itemClicked() {
        this.props.navigateToFarmer();
    }

    /** Function to sort the list data by Farmer name in alphabetical order */
    private sortList(farmers?: FarmerType[]): FarmerType[] {

        var sortedList: FarmerType[] = [];
        if (farmers === undefined) {
            return sortedList;
        }
        sortedList = farmers.sort((f1: FarmerType, f2: FarmerType) => {
            if (f1.name > f2.name) {
                return 1;
            }
            if (f1.name < f2.name) {
                return -1;
            }
            return 0;
        });
        return sortedList;
    }

    /************************* React *************************/

    public render(): JSX.Element {
        return (
            <Content>

                <List
                    dataArray={this.sortList(this.props.listItems)}
                    renderRow={this.renderItem}
                    // renderSectionHeader={this.renderSectionHeader}
                />

            </Content>
        );
    }

    /** Function to render the section headers -Currently disabled- */
    // private renderSectionHeader(sectionData: FarmerType, rowID: ReactText) {
    //     if (rowID == 'undefined') {
    //         return (
    //             <ListItem>
    //                 <Text>{sectionData.name.toString()}</Text>
    //             </ListItem>
    //         );
    //     } else {
    //         return <ListItem/>
    //     }
    // }

    /** Function to render the individual list items */
    private renderItem(info: FarmerType) {
        return (
            <ListItem key={info.id} onPress={this.itemClicked}>
                <View>
                    <Text style={styles.name}>
                        {info.name}
                    </Text>
                    <Text style={styles.phone}>
                        Phone: {info.phoneNumber}
                    </Text>
                </View>
            </ListItem>
        );
    }
}

const FarmerSearchPage = createSearchPage<FarmerSearchPropsType>(FarmerSearch, 'Search Farmers');

/************************* Redux ************************/

const mapStateToProps: MapStateToProps<StorePropsType, OwnPropsType, State> = (state) => {
  return {};
};

const mapDispatchToProps: MapDispatchToProps<DispatchPropsType, OwnPropsType> = (dispatch) => {
  return {
    navigateToFarmer: () => dispatch(navActions.navigateTo(Route.FARMER)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FarmerSearchPage);