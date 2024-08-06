import React, { useEffect, useState,useRef  } from "react";
import { View, Text, StyleSheet, ImageBackground, ScrollView, Animated,TextInput, TouchableOpacity,FlatList,Image, TextBase, Modal } from "react-native";
const image = require("../assets/image.png");

const Background = () => {
    const [imaName, setImaName] = useState("3D images");
    const [imageData, setImageData] = useState([]);
    const [is_login,chage_loding] = useState(true);
    const [image_selected,change_selected] = useState(false);
    const [selected_image_data,change_image_data] = useState(null);
    const UNSPLASH_ACCESS_KEY = 'gGac56YJVO9yJ2hxVEmEnyEhOTTnMZCMg-Z1cyM_dxA';
    const focus_image = (item) =>{
        change_selected(true);
        change_image_data(item);
    }
    const unfocus_image = () => {
        change_selected(false);
        change_image_data(null);
    }
    const scrollX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(scrollX, {
                toValue: 1,
                duration: 10000, 
                useNativeDriver: true,
            })
        ).start();
    }, [scrollX]);
    const fetchImages = async (item=null) => {
        chage_loding(true);
        try {
            let temp_val = (item) ? item : imaName ;
            let response = await fetch(`https://api.unsplash.com/search/photos?query=${temp_val}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=20`);
            let json = await response.json();
            setImageData(json.results);
            chage_loding(false);
        } catch (err) {
            console.log("error", err);
        }
    };
    useEffect(() => {
        fetchImages();
    }, []);
    const translateX = scrollX.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -100*5], 
    });
    const final_function = async (value) =>{
        setImaName(value);
        fetchImages(value);
        
    }
    return (
        <View style={styles.center}>
            <ImageBackground source={image} resizeMode="cover" style={styles.image}>
                <Text style={styles.heading}>Image Filter</Text>
                <View style={styles.flexDiv}>
                    <TextInput 
                        placeholder="Enter the Name of Image" 
                        style={styles.searchBox} 
                        onChangeText={setImaName} 
                        value={imaName}
                    />
                    <TouchableOpacity style={styles.button} onPress={fetchImages}>
                        <Text>Search</Text>
                    </TouchableOpacity>
                </View>
                <Animated.View style={[styles.scrollContainer, { transform: [{ translateX }] }]}>
                    <View  style={styles.item}>
                        <TouchableOpacity onPress={() =>{final_function("3D images")}}><Text style={styles.text2}>3D Images</Text></TouchableOpacity>
                    </View>
                    <View  style={styles.item}>
                        <TouchableOpacity onPress={() => {final_function("cars");}}><Text style={styles.text2}>Cars</Text></TouchableOpacity>
                    </View>
                    <View  style={styles.item}>
                        <TouchableOpacity onPress={() => {final_function("Ai iMages");}}><Text style={styles.text2}>Ai iMages</Text></TouchableOpacity>
                    </View>
                    <View  style={styles.item}>
                        <TouchableOpacity onPress={() => {final_function("love");}}><Text style={styles.text2}>love</Text></TouchableOpacity>
                    </View>
                    <View  style={styles.item}>
                        <TouchableOpacity onPress={() => {final_function("Animal");}}><Text style={styles.text2}>Animal</Text></TouchableOpacity>
                    </View>
                </Animated.View>
                {(is_login) ?  <Text style={styles.loading} >Loading.... </Text> : 
                (imageData && imageData.length > 0) ? <FlatList
                    style = {{marginTop : 20}}
                    data={imageData}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.imageContainer} onPress={() => focus_image(item)}>
                            <Image source={{ uri: item.urls.small }} style={styles.imageItem} />
                            <Text style={styles.text}>Likes💕 = {item.likes} </Text>
                        </TouchableOpacity>
                    )}
                /> : <Text style={styles.loading} >No Relavent Images</Text>}
            </ImageBackground>
            {image_selected && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={true}
                    onRequestClose={unfocus_image}
                >
                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.closeButton} onPress={unfocus_image}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: selected_image_data.urls.small }} style={styles.modalImage} />
                            <View style={styles.imageDetails} >
                                <Text style={styles.text}>width = {selected_image_data.width}</Text>
                                <Text style={styles.text}>height = {selected_image_data.width}</Text>
                                <Text style={styles.text}>user = {selected_image_data.user.name}</Text>
                                <Text style={styles.text}>Discription = {selected_image_data.description || "No description"}</Text>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: "center",
    },
    flexDiv: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingHorizontal: 20,
        marginBottom : 20
    },
    loading :{
        color : "black",
        fontSize : 25,
        marginLeft : "35%",
        marginTop : 35
    },
    image: {
        width: '100%',
        height: '100%',
    },
    heading: {
        color: "black",
        textTransform: "capitalize",
        fontSize: 42,
        lineHeight: 84,
        fontWeight: 'bold',
        paddingLeft: 10,
        marginBottom: 20,
    },
    searchBox: {
        width: '65%',
        borderRadius: 10,
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 1,
        padding: 10,
        backgroundColor: "white",
        color: "black",
        marginRight: 10,
        height: 50,
    },
    button: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        height: 50,
        width: '25%',
        backgroundColor: "green",
        justifyContent: 'center',
    },
    imageItem :{
        width : 150,
        height : 150,
        cursor : "pointer",
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 2,
        borderRadius : 10
    },
    imageContainer :{
        flex : 1,
        justifyContent : "center",
        alignItems : "center",
        marginBottom : 10
    },
    modalView: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        zIndex : 100
    },
    closeButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },
    modalImage: {
        width: 400,
        height: 500,
        resizeMode: 'contain',
    },
    imageDetails: {
        marginTop: 10,
        height : 100,
    },
    text :{
        color: 'white',
    },
    scrollContainer: {
        flexDirection: 'row',
    },
    item: {
        width: 120,
        marginHorizontal: 10,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height : 40,
        padding : 5,
        borderRadius : 10
    },
    text2 :{
        color : "black",
        fontSize : 22,
    }
});

export default Background;
