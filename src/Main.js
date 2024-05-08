import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons for icons

const Main = () => {
    const [basecur, setBaseCur] = useState("USD");
    const [finalcur, setFinalCur] = useState("INR");
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
            convertAmount(amount); // Trigger conversion when conversion rates are updated
        } catch (error) {
            console.log("Error fetching data:", error);
        }
    }

    const handleAmountChange = (value) => {
        setAmount(value);
        convertAmount(value);
        if (/^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    }

    const convertAmount = (value) => {
        const rate = conversionRates[finalcur];
        const converted = parseFloat(value) * rate;
        setConvertedAmount(converted.toFixed(2)); // Round to 2 decimal places
    };

    const swap = () => {
        setBaseCur(finalcur);
        setFinalCur(basecur);
        convertAmount(amount); // Trigger conversion when currencies are swapped
    }
    
    const clear = () => {
        setAmount("");
        setConvertedAmount("");
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder='Enter The Amount'
                keyboardType='numeric'
                value={amount}
                onChangeText={handleAmountChange}
            />
            <View style={styles.pickerContainer}>
                <Picker
                    style={styles.picker}
                    selectedValue={basecur}
                    onValueChange={(value) => {setBaseCur(value); convertAmount(amount);}}>
                    {Object.keys(conversionRates).map((currency) => (
                        <Picker.Item key={currency} label={currency} value={currency} />
                    ))}
                </Picker>
                <MaterialIcons name="swap-vert" size={24} color="black" onPress={swap} />
                <Picker
                    style={styles.picker}
                    selectedValue={finalcur}
                    onValueChange={(value) => {setFinalCur(value); convertAmount(amount);}}>
                    {Object.keys(conversionRates).map((currency) => (
                        <Picker.Item key={currency} label={currency} value={currency} />
                    ))}
                </Picker>
            </View>
            
            <Text>{`Converted Amount: ${convertedAmount}`}</Text>
            <View style={styles.buttonContainer}>
                <Button title='Convert' onPress={convertAmount} />
                <Button title='Clear' onPress={clear} />
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
        borderRadius: 15,
        marginBottom: 10
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    picker: {
        flex: 1,
        height: 50
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '80%',
        marginTop: 20
    }
});
