
import React,{Component} from 'react';
import {Text,View,ScrollView,Alert,StyleSheet,Image} from 'react-native';

import {Icon,Input,CheckBox,Button} from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import {createBottomTabNavigator} from 'react-navigation';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import{baseUrl} from '../shared/baseUrl';
import * as ImageManipulator from "expo-image-manipulator";
class LoginTab extends Component{

    constructor(props){
        super(props);
        this.state={
            username:'',
            password:'',
            remember:false
        }
    }
    componentDidMount(){
        
        SecureStore.getItemAsync('userinfo')
            .then((userdata) => {
                let userinfo = JSON.parse(userdata);
                if (userinfo) {
                    this.setState({username: userinfo.username});
                    this.setState({password: userinfo.password});
                    this.setState({remember: true});
                }
            })
    }
    handleLogin(){
        console.log(JSON.stringify(this.state));
        if(this.state.remember){
            SecureStore.setItemAsync(
                'userinfo',
                JSON.stringify({username:this.state.username,password:this.state.password,remember:this.state.remember})

                ).catch((error)=> console.log('Could not save userinfo',error));

        }
        else{
            SecureStore.deleteItemAsync('userinfo').catch((error)=> console.log('Could not delete userinfo'));
        }
    }
    static navigationOptions={
        title:'Login',
        tabBarIcon:({
            tintColor
        })=>(
            <Icon name="sign-in" type="font-awesome" size={24} iconStyle={{color:tintColor}}/>
        )
    };
    render(){
        return(
            <ScrollView>
            <View style={styles.container}>
                <Input placeholder="Username"
                leftIcon={{type:'font-awesome',name:'user-o'}}
                onChangeText={(username)=>this.setState({username:username})}
               value={this.state.username}
               containerStyle={styles.formInput}
               />
               <Input placeholder="Password"
                leftIcon={{type:'font-awesome',name:'key'}}
                onChangeText={(pwd)=>this.setState({password:pwd})}
               value={this.state.password}
               containerStyle={styles.formInput}
               />
               <CheckBox
               title="Remember Me"
               checked={this.state.remember}
               containerStyle={styles.formCheckbox}
               center
               onPress={()=>this.setState({remember: !this.state.remember})}

               />
               <View style={styles.formButton}>
               <Button
                   onPress={()=>this.handleLogin()}
                   title="Login"
                   icon={<Icon name='sign-in' type="font-awesome" size={24} color='white'/>}
                   buttonStyle={{backgroundColor:'#512DA8'}}
                   />
              
               </View>
               <View style={styles.formButton}>
                    <Button
                        onPress={() => this.props.navigation.navigate('Register')}
                        title=" Register"
                        type="clear"
                        icon={
                            <Icon
                                name='user-plus'
                                type='font-awesome'            
                                size={24}
                                color= 'blue'
                            />
                        }
                        titleStyle={{
                            color: "blue"
                        }}
                        />
                </View>
            </View>
            </ScrollView>
        );
    }
}



class RegisterTab extends Component{
    constructor(props){
        super(props);
        this.state={
            username:'',
            password:'',
            firstname:'',
            lastname:'',
            email:'',
            remember:false,
            imageUrl:baseUrl+'images/logo.png'
        }
    }
    static navigationOptions={
        title:'Register',
        tabBarIcon:({
            tintColor
        })=>(
            <Icon name="user-plus" type="font-awesome" size={24} iconStyle={{color:tintColor}}/>
        )
    };
    getImageFromCamera=async()=>{
        const cameraPermission=await Permissions.askAsync(Permissions.CAMERA);
        const cameraRollPermission=await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if(cameraPermission.status==='granted' && cameraRollPermission.status){
            let capturedImage = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
            });
            if(!capturedImage.cancelled){
                this.processImage(capturedImage.uri);
            }

        }
    }
    getImageFromGallery=async()=>{
        const cameraPermission=await Permissions.askAsync(Permissions.CAMERA);
        const cameraRollPermission=await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if(cameraPermission.status==='granted' && cameraRollPermission.status){
            let capturedImage = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
            });
            if(!capturedImage.cancelled){
                this.processImage(capturedImage.uri);
            }

        }
        


    }
    processImage=async (imageUri)=>{
        let processedImage=await ImageManipulator.manipulateAsync(
            imageUri,
            [
                {
                    resize:{width:400}

                }
            ],
            {format:'png'}
        );
        this.setState({imageUrl:processedImage.uri})
    }
    handleRegister(){
        console.log(JSON.stringify(this.state));
        if(this.state.remember)
        SecureStore.setItemAsync(
            'userinfo',
            JSON.stringify({username:this.state.username,password:this.state.password,remember:this.state.remember})

            ).catch((error)=> console.log('Could not save userinfo',error));
    }
    render(){
        return(
            <ScrollView>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image source={{uri:this.state.imageUrl}}
                    loadingIndicatorSource={require('./images/logo.png')}
                    style={styles.image} 
                    
                    />
                    <Button
                    title="Camera"
                    onPress={this.getImageFromCamera}
                    />
                    <Button
                    title="Gallery"
                    onPress={this.getImageFromGallery}
                    />
                </View>

                <Input placeholder="Username"
                leftIcon={{type:'font-awesome',name:'user-o'}}
                onChangeText={(username)=>this.setState({username:username})}
               value={this.state.username}
               containerStyle={styles.formInput}
               />
               <Input placeholder="Password"
                leftIcon={{type:'font-awesome',name:'key'}}
                onChangeText={(pwd)=>this.setState({password:pwd})}
               value={this.state.password}
               containerStyle={styles.formInput}
               />
               <Input placeholder="First Name"
                leftIcon={{type:'font-awesome',name:'user-o'}}
                onChangeText={(firstname)=>this.setState({firstname:firstname})}
               value={this.state.firstname}
               containerStyle={styles.formInput}
               />
               <Input placeholder="Last Name"
                leftIcon={{type:'font-awesome',name:'user-o'}}
                onChangeText={(lastname)=>this.setState({lastname:lastname})}
               value={this.state.lastname}
               containerStyle={styles.formInput}
               />
               <Input placeholder="Email"
                leftIcon={{type:'font-awesome',name:'envelope-o'}}
                onChangeText={(email)=>this.setState({email:email})}
               value={this.state.email}
               containerStyle={styles.formInput}
               />
               <CheckBox
               title="Remember Me"
               checked={this.state.remember}
               containerStyle={styles.formCheckbox}
               center
               onPress={()=>this.setState({remember: !this.state.remember})}

               />
               <View style={styles.formButton}>
                   <Button
                   onPress={()=>this.handleRegister()}
                   title="Register"
                   icon={<Icon name='user-plus' type="font-awesome" size={24} color='white'/>}
                   buttonStyle={{backgroundColor:'#512DA8'}}
                   />
               </View>
            </View>
            </ScrollView>
        );
    }
    
}
const Login=createBottomTabNavigator({
    Login:LoginTab,
    Register:RegisterTab
},{
    tabBarOptions:{
        activeBackgroundColor:'#9575CD',
        inactiveBackgroundColor:'#D1C4E9',
        activeTintColor:'white',
        inactiveTintColor:'grey'
    }
});
const styles=StyleSheet.create({
    container:{
        justifyContent:'center',
        margin:20
    },
    formInput:{
        margin:20
    },
    formCheckbox:{
        margin:20,
        backgroundColor:null
    },
    formButton:{
        margin:60
    },
    imageContainer:{
        flex:1,
        justifyContent:'space-around',
        flexDirection:'row',
        margin:20,

    },
    image:{
        margin:10,
        width:80,
        height:60
    }
});
export default Login;
