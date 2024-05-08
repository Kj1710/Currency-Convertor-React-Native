import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';

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
            setConversionRates(data.data.conversion_rates);
            convertAmount(amount);
        } catch (error) {
            console.log("Error fetching data:", error);
        }
    }

    const handleAmountChange = (value) => {
        if (/^\d*\.?\d*$/.test(value)) {
            setAmount(value);
            convertAmount(value);
        }
    }

    const convertAmount = (value) => {
        const rate = conversionRates[finalcur];
        const converted = parseFloat(value) * rate;
        setConvertedAmount(converted.toFixed(2));
    };

    const swap = () => {
        setBaseCur(finalcur);
        setFinalCur(basecur);
        convertAmount(amount);
    }
    
    const clear = () => {
        setAmount("");
        setConvertedAmount("");
    }

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <TextInput
                    style={styles.input}
                    placeholder='Enter The Amount'
                    keyboardType='numeric'
                    value={amount}
                    onChangeText={handleAmountChange}
                />
            </View>
            <View style={styles.section2}>
                <View style={styles.pickerContainer}>
                    <Picker
                        style={styles.picker}
                        selectedValue={basecur}
                        onValueChange={(value) => {setBaseCur(value); convertAmount(amount);}}>
                        {Object.keys(conversionRates).map((currency) => (
                            <Picker.Item key={currency} label={currency} value={currency} />
                        ))}
                    </Picker>
                    <Picker
                        style={styles.picker}
                        selectedValue={finalcur}
                        onValueChange={(value) => {setFinalCur(value); convertAmount(amount);}}>
                        {Object.keys(conversionRates).map((currency) => (
                            <Picker.Item key={currency} label={currency} value={currency} />
                        ))}
                    </Picker>
                </View>
                <View style={styles.buttonContainer}>
                    <Button title='Convert' onPress={convertAmount} color="#4CAF50" />
                    <Button title='Clear' onPress={clear} color="#FF5733" />
                   
                    <MaterialIcons name="swap-vert" size={24} color="black" onPress={swap} />
                </View>
                <Text style={styles.resultText}>{`Converted Amount: ${convertedAmount}`}</Text>
            </View>
        </View>
    );
}

export default Main;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: "#F5F5F5",
    },
    section: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 15,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF',
    },
    section2: {
        width: '100%',
        marginBottom: 20,
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 100,
    },
    picker: {
        flex: 1,
        height: 70,
        marginRight: 10,
        backgroundColor: '#FFFFFF',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginTop:50,
    },
    resultText: {
        marginTop: 20,
        fontSize: 16,
    }
});
