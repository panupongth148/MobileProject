import React from "react";
// import library ที่จำเป็น
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';

import { Ionicons } from "@expo/vector-icons";

// import screen ที่เกี่ยวข้อง
import Login from './../screens/Login';
import Register from './../screens/Register';
import MyInfo from './../screens/MyInfo';
import Enroll from './../screens/Enroll';
import ManageQueue from './../screens/ManageQueue';
import QueuePatientData from './../screens/QueuePatientData';
import QueueSelection from './../screens/QueueSelection';
import Home from './../screens/Home';
import Departments from './../screens/Departments';
import Ward from './../screens/Ward';
import WardType from './../screens/WardType';
import Patient from './../screens/Patient';
import Medicine from './../screens/Medicine';
import Welcome from './../screens/Welcome';
import GenTreatment from "../screens/genTreatment";


// generate data
import GenWard from "../generate/genward";
import GenBed from "../generate/genbed";
import GenMedicine from "../generate/genmedicine";
import GenMedicPerson from "../generate/genMedical_peson";
import GenConnectMedic from "../generate/genaratePreMedicine";



// สร้าง navigator ตามโจทย์กำหนด
const MainStack = createNativeStackNavigator();
const MyTab = createBottomTabNavigator();
const MyInfoStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const MyDrawer = createDrawerNavigator();
const QueueStack = createNativeStackNavigator();
const EnrollStack = createNativeStackNavigator();

function MyInfoScreen() {
    return (
        <MyInfoStack.Navigator initialRouteName="S1" screenOptions={{ headerStyle: { backgroundColor: "#3b7" }, headerTintColor: "white" }}>

            <MyInfoStack.Screen name="MyInformation" component={ MyInfo } />
            <MyInfoStack.Screen name="Enroll" component={ Enroll } />
            
        </MyInfoStack.Navigator>
    );
}

function EnrollScreen() {
    return (
        <EnrollStack.Navigator initialRouteName="S1" screenOptions={{ headerStyle: { backgroundColor: "#3b7" }, headerTintColor: "white" }}>

            <EnrollStack.Screen name="Enroll" component={ Enroll } />
            <EnrollStack.Screen name="Patient" component={ PatientScreen } />
            
        </EnrollStack.Navigator>
    );
}

function HomeScreen() {
    return (
        <HomeStack.Navigator initialRouteName="S1" screenOptions={{ headerStyle: { backgroundColor: "#3b7" }, headerTintColor: "white" }}>
            
            <HomeStack.Screen name="Home" component={ Home } />
            <HomeStack.Screen name="Department" component={ Departments } />
            <HomeStack.Screen name="WardType" component={ WardType } />
            <HomeStack.Screen name="Ward" component={ Ward } />
            <HomeStack.Screen name="PatientScreen" component={ PatientScreen } />

        </HomeStack.Navigator>
    );
}

function PatientScreen({route}) {
    const patient = useSelector(state => state.users);
    
    return (
        <MyDrawer.Navigator initialRouteName="Patient" screenOptions={{ headerStyle: { backgroundColor: "#3b7" }, headerTintColor: "white" }}>
            <MyDrawer.Screen name="Patient" component={ Patient } initialParams={{ params: (patient.patientInfo ? patient : route.params.patientData) }} />
            <MyDrawer.Screen name="Medicine" component={ Medicine } initialParams={{ params: (patient.patientInfo ? patient.medicineData : route.params.patientData.medicineData) }} />
        </MyDrawer.Navigator>
    );
}

function QueueScreen() {
    return (
        <QueueStack.Navigator initialRouteName="S1" screenOptions={{ headerStyle: { backgroundColor: "#3b7" }, headerTintColor: "white" }}>
            
            <QueueStack.Screen name="Queue" component={ ManageQueue } />
            <QueueStack.Screen name="Patient Data" component={ QueuePatientData } />
            <QueueStack.Screen name="Selection" component={ QueueSelection } />
            
        </QueueStack.Navigator>
    );
}

function MyApp() {
    const user = useSelector(state => state.users.accountInfo);
    const medical = useSelector(state => state.users.medicalRole);
    const patient = useSelector(state => state.users.treatmentInfo);
    
    return (
        <MyTab.Navigator screenOptions={
            {
                headerStyle: { backgroundColor: "#3b7" },
                headerTintColor: "white",
                tabBarStyle: { backgroundColor: "#3b7" },
                tabBarInactiveTintColor: "white",
                tabBarActiveTintColor: "#545",
            }
        }>
      
            { user.Type == "medic_person" ?
                <MyTab.Screen name="Home" component={ HomeScreen }
                    options={{
                        tabBarIcon: ({ color, size }) => {
                            return <Ionicons name="analytics" size={size} color={color} />;
                        },
                        headerShown: false,
                    }} /> :
                    
                <MyTab.Screen name="Home" component={ patient ? PatientScreen : EnrollScreen }
                    options={{
                        tabBarIcon: ({ color, size }) => {
                            return <Ionicons name="analytics" size={size} color={color} />;
                        },
                        headerShown: false,
                    }} />
            }

            { user.Type == "medic_person" && medical.Role == "nurse" ? <MyTab.Screen name="Manage Queue" component={ QueueScreen }
                options={{
                    tabBarIcon: ({ color, size }) => {
                        return <Ionicons name="md-menu" size={size} color={color} />;
                    },
                    headerShown: false,
                }} /> : null
            }

            { user.Type == "medic_person" && medical.Role == "doc" ? <MyTab.Screen name="Prescription" component={ GenTreatment }
                options={{
                    tabBarIcon: ({ color, size }) => {
                        return <Ionicons name="md-menu" size={size} color={color} />;
                    }
                }} /> : null
            }

            <MyTab.Screen name="My information" component={ MyInfoScreen }
                options={{
                    tabBarIcon: ({ color, size }) => {
                        return <Ionicons name="md-menu" size={size} color={color} />;
                    },
                    headerShown: false,
                }} />

        </MyTab.Navigator>
    );
}

// Navigator หลัก
export default function MainNavigator() {
    return (

        <NavigationContainer>
    
            <MainStack.Navigator screenOptions={{ headerStyle: { backgroundColor: "#3b7" }, headerTintColor: "white" }} >
                
                {/* <MainStack.Screen name="Gen" component={ GenTreatment } /> */}
                
                <MainStack.Screen name="Welcome" component={ Welcome } />

                <MainStack.Screen name="Login" component={ Login } />

                <MainStack.Screen name="Register" component={ Register } />

                <MainStack.Screen name="Main" component={ MyApp } options={{ headerShown: false }} />

            </MainStack.Navigator>

        </NavigationContainer>

    );
}