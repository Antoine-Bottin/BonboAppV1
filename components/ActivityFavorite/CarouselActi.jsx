import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, FlatList, Animated } from 'react-native'
import CarouselItem from './CarouselActivItem'

const { width, heigth } = Dimensions.get('window')

const CarouselFav = ({ navigation, user, data }) => {
    const scrollX = new Animated.Value(0)
    let position = Animated.divide(scrollX, width)
    const [dataList, setDataList] = useState(data)
    useEffect(()=> {
        setDataList(data)
    })

    //Creation Flatlist Shape dans display it in Caroussel ActivItem

    if (data && data.length) {
        return (
            <View style={{marginLeft: 20}}>
                <FlatList data={data}
                    ref = {(flatList) => {flatList = flatList}}
                    keyExtractor={(item, index) => 'key' + index}
                    horizontal
                    // pagingEnabled
                    scrollEnabled
                    snapToAlignment="center"
                    scrollEventThrottle={16}
                    decelerationRate={"fast"}
                    showsHorizontalScrollIndicator={true}
                    renderItem={({ item }) => {
                        return <CarouselItem item={item} navigation={navigation} />
                    }}
                />
            </View>
        )
    }

    return null
}

const styles = StyleSheet.create({
    dotView: { 
        flexDirection: 'row',
        justifyContent: 'center' 
    },
})

export default CarouselFav