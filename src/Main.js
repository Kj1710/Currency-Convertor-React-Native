import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const Main = () => {
    const [basecur, setbasecur] = useState("USD");
    const [finalcur, setfinalcur] = useState("INR");
    const [conversionRates, setConversionRates] = useState({});
    const [amount, setAmount] = useState("");
    const [convertedAmount, setConvertedAmount] = useState("");

    useEffect(() => {
        fetchData(basecur);
    }, [basecur]);

    const fetchData = async (currency) => {
        try {
            const data = await axios.get(`https://v6.exchangerate-api.com/v6/eb90a3ea22e4edf6e59c7c22/latest/${currency}`);
            console.log(data.data.conversion_rates);
            setConversionRates(data.data.conversion_rates);
        } catch (error) {
            console.log("Error fetching data:", error);
        }
    }

    const handleAmountChange = (value) => {
        setAmount(value);
        convertAmount(value);
    }

    const convertAmount = (value) => {
        const rate = conversionRates[finalcur];
        const converted = parseFloat(value) * rate;
        setConvertedAmount(converted.toFixed(2)); // Round to 2 decimal places
    };

    const swap =() =>{
        setbasecur(finalcur);
        setfinalcur(basecur);
    }
    
    const clear=()=>{
        setAmount("");
        setConvertedAmount("");
    }

    const targetcurrencyItem = Object.keys(conversionRates)
        .filter((currency) => currency !== basecur)
        .map((currency) => (
            <Picker.Item key={currency} label={currency} value={currency} />
        ));

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder='Enter The Amount'
                keyboardType='numeric'
                value={amount}
                onChangeText={handleAmountChange}
            />
            <Picker
                style={styles.picker1}
                selectedValue={basecur}
                onValueChange={(value) => setbasecur(value)}>
                {Object.keys(conversionRates).map((currency) => (
                    <Picker.Item key={currency} label={currency} value={currency} />
                ))}
            </Picker>
            <Picker
                style={styles.picker1}
                selectedValue={finalcur}
                onValueChange={(value) => setfinalcur(value)}>
                {targetcurrencyItem}
            </Picker>
            
            <Text>{`Converted Amount: ${convertedAmount}`}</Text>
            <View>
                <Button title='Convert' onPress={handleAmountChange}></Button>
                <Button title="swap" onPress={swap}></Button>

                <Button title='clear' onPress={clear}></Button>
            </View>
        </View>
    );
}

export default Main;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    input: {
        width: "90%",
        height: 30,
        borderWidth: 1,
        borderRadius: 15
    },
    picker1: {
        width: "100%",
        marginBottom: 10
    }
});
