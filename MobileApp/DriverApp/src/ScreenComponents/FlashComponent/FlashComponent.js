import React from 'react';
import {
  ScrollView,
  Text,
  View,
  BackHandler,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  Alert
} from 'react-native';
// import styles from './styles.js';
import styles from '../../AppDesigns/currentApp/styles/ScreenComponentStyles/FlashComponentStyles.js';
import { colors, sizes } from '../../AppDesigns/currentApp/styles/styles.js';
import ValidationComponent from "react-native-form-validator";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Loading from '../../../AppDesigns/currentApp/styles/ScreenComponentStyles/LoadingStyles.js';

const window = Dimensions.get('window');

export default class FlashComponent extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      productImg:[],
      newProducts: [],
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      newProducts: nextProps.newProducts,
      type: nextProps.type
    })
  }

  componentDidMount(){
     this.setState({
        newProducts : this.props.newProducts,
        type        : this.props.type
    })
  }



  render() {
    return (
      <View style={{marginBottom:"15%"}}>
        <View>
          <Text style={styles.title}>Flash Sale</Text> 
        </View>
        <View style={{width:'100%',flexDirection:'row',flexWrap:'wrap',}}>
          {
            this.state.newProducts && this.state.newProducts.length > 0 ?
              this.state.newProducts.map((item, i) => {
                return(
                 <View  key={i}>
                  <View  style={[{borderWidth:1,borderColor:'#f1f1f1',backgroundColor: '#ccc',width:175,height:100,flexDirection:'row',marginBottom:80,borderRadius:10,},(i%2==0?{marginRight:10}:{})]}>
                  <TouchableOpacity>
                      <Image
                        source={{uri:item.productImage[0] ? item.productImage[0] : '../../AppDesigns/currentApp/images/notavailable.jpg'}}
                        style={{ height:100,borderRadius:10,width:175,backgroundColor:"f1f1f1",marginBottom:25}}
                      />
                    <Text style={{backgroudColor:'#ff0',textAlign:'center',position:'absolute',top:85,paddingHorizontal:10,flexShrink: 1,zIndex:1,fontSize:12,fontFamily:"Montserrat-SemiBold",flexWrap:'wrap',color:'#666',paddingVertical:25,}}>{item.productName}</Text>
                    </TouchableOpacity>
                    </View>
                  </View>
                  
                 
                   )
                 })
               :
                null
              }
        </View>
      </View>
    );
  }
}
