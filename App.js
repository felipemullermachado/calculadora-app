import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { Entypo } from "@expo/vector-icons";
import uuid from "react-native-uuid";

export default function App() {
  const buttons = [
    "%",
    "(",
    ")",
    "÷",
    7,
    8,
    9,
    "x",
    4,
    5,
    6,
    "-",
    3,
    2,
    1,
    "+",
    0,
    ".",
    "DEL",
    "=",
  ];
  const [currentNumber, setCurrentNumber] = useState("");
  const [lastNumber, setLastNumber] = useState("");
  const [data, setData] = useState([]);
  const [listOpen, setListOpen] = useState(false);
  const { getItem, setItem } = useAsyncStorage("@calculafelipe:calculos");

  //Para atualizar os dados no histórico
  useEffect(() => {
    const handleFetchData = async () => {
      const response = await getItem();
      const data = response ? JSON.parse(response) : [];
      setData(data);
    };
    handleFetchData();
  }, [data]);

  //Para realizar a troca de telas
  const handleToggle = () => {
    setListOpen(!listOpen);
  };

  //Método responsável por realizar a persistência de dados
  //Os dados são armazenados localmente
  const saveData = async (calculo) => {
    const id = uuid.v4();
    const newData = { id, calculo };

    const response = await getItem();
    const previousData = response ? JSON.parse(response) : [];
    const data = [...previousData, newData];
    //salva o item no storage local
    await setItem(JSON.stringify(data));
  };

  //Método responsável por realizar as equações
  const calculator = () => {
    const splitNumbers = currentNumber.split(" ");
    const firstNumber = parseFloat(splitNumbers[0]);
    const secondNumber = parseFloat(splitNumbers[2]);
    const operator = splitNumbers[1];

    let resultado;
    switch (operator) {
      case "+":
        resultado = (firstNumber + secondNumber).toString();
        setCurrentNumber(resultado);
        break;
      case "-":
        resultado = (firstNumber - secondNumber).toString();
        setCurrentNumber(resultado);
        break;
      case "x":
        resultado = (firstNumber * secondNumber).toString();
        setCurrentNumber(resultado);
        break;
      case "÷":
        resultado = (firstNumber / secondNumber).toString();
        setCurrentNumber(resultado);
        break;
      case "%":
        resultado = (firstNumber % secondNumber).toString();
        setCurrentNumber(resultado);
        break;
    }
    let data = currentNumber + " = " + resultado;
    saveData(data);
    setLastNumber(currentNumber);
  };

  //Método responsável por ficar escutando quais são os botões pressionados pelo usuário e apresentá-los na tela
  const handleInput = (button) => {
    if (
      button === "+" ||
      button === "-" ||
      button === "x" ||
      button === "÷" ||
      button === "%"
    ) {
      if (currentNumber.lastIndexOf(" ") === currentNumber.length - 1) {
        setCurrentNumber(currentNumber.substring(0,currentNumber.length - 3) + " " + button + " ")
      } else {
        setCurrentNumber(currentNumber + " " + button + " ");
      }
      return;
    }
    if (button === "(") {
      return;
    }
    if (button === ")") {
      return;
    }

    if (button === ".") {
      let arrayVerificador = currentNumber.split(" ")
      for(let i = 0; i < arrayVerificador.length; i++){
        if(arrayVerificador[i].split(".").length - 1 < 1){
          setCurrentNumber(currentNumber + button);
        } else {
          setCurrentNumber(currentNumber);
        }
      }
      if (currentNumber.lastIndexOf(".") === currentNumber.length - 1) {
        setCurrentNumber(currentNumber.substring(0,currentNumber.length - 1) + button)
      }
    } else {
      setCurrentNumber(currentNumber + button);
    }

    switch (button) {
      case "DEL":
        if (currentNumber.lastIndexOf(" ") === currentNumber.length - 1) {
          setCurrentNumber(
            currentNumber.substring(0, currentNumber.length - 3)
          );
        } else {
          setCurrentNumber(
            currentNumber.substring(0, currentNumber.length - 1)
          );
        }
        if (lastNumber.lastIndexOf(" ") === lastNumber.length - 1) {
          setLastNumber(lastNumber.substring(0, lastNumber.length - 3));
        } else {
          setLastNumber(lastNumber.substring(0, lastNumber.length - 1));
        }
        return;
      case "=":
        setLastNumber(currentNumber + " = ");
        calculator();
        return;
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: "#E0E4F0",
      flex: 1,
    },
    results: {
      width: "100%",
      flex: 1,
      alignItems: "flex-end",
      justifyContent: "center",
    },
    resultText: {
      color: "#4866AA",
      margin: 10,
      marginBottom: 20,
      fontSize: 50,
    },

    historyText: {
      color: "#4866AA",
      fontSize: 30,
      marginRight: 10,
      alignSelf: "flex-end",
    },
    btnMenu: {
      backgroundColor: "#ffffff",
      alignItems: "center",
      justifyContent: "center",
      width: 50,
      height: 50,
      marginTop: 50,
      marginLeft: 20,
      borderRadius: 25,
    },
    buttons: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "flex-end",
    },
    button: {
      backgroundColor: "#ffffff",
      borderColor: "#e5e5e5",
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      minWidth: "25%",
      minHeight: 90,
    },
    textButton: {
      color: "#4866AA",
      fontSize: 25,
    },
    list: {
      marginTop: 20,
      marginLeft: 20,
    },
    listText: {
      fontSize: 14,
      paddingBottom: 8,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btnMenu}>
        <Entypo
          name={!listOpen ? "menu" : "calculator"}
          size={24}
          color={"black"}
          onPress={handleToggle}
        />
      </TouchableOpacity>
      {!listOpen && (
        <>
          <View style={styles.results}>
            <Text style={styles.resultText}>{currentNumber}</Text>
            <Text style={styles.historyText}>{lastNumber}</Text>
          </View>
          <View style={styles.buttons}>
            {buttons.map((button, index) =>
              button === "=" ? (
                <TouchableOpacity
                  onPress={() => handleInput(button)}
                  key={index}
                  style={[styles.button, { backgroundColor: "#FF8705" }]}
                >
                  <Text
                    style={[
                      styles.textButton,
                      { color: "white", fontSize: 30 },
                    ]}
                  >
                    {button}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => handleInput(button)}
                  key={index}
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        button === "+" ||
                        button === "-" ||
                        button === "x" ||
                        button === "÷"
                          ? "#4866AA"
                          : "white",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.textButton,
                      {
                        color:
                          button === "+" ||
                          button === "-" ||
                          button === "x" ||
                          button === "÷"
                            ? "white"
                            : "#4866AA",
                      },
                    ]}
                  >
                    {button}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </>
      )}
      {listOpen && (
        <FlatList
          style={styles.list}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <Text style={styles.listText}>{item.calculo}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
