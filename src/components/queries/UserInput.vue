import time 

<template>
    <section>
        <base-dialog v-if="formInputIsInvalid" title="Invalid Input" @close="confirmError">
            <template #default>
                <p>At lease one input is incorrect</p>
                <p>Please fill out the textarea and choose a query type</p>
            </template>
            <template #actions>
                <base-button @click="confirmError">Okay</base-button>
            </template>
        </base-dialog>
        <base-card>
            <h2>DZD Query Machine (Alpha)</h2>
            <br>
            <form @submit.prevent="gogoQuery">
                <keep-alive>
                    <div class="form-control" :class="{ invalid: inputValidity === 'invalid' }">
                        <label for="input">
                            <h4> Your Input: </h4>
                        </label>
                        <textarea id="input" name="input" v-model.trim="userInput" rows="4" cols="50"
                            placeholder="Please seperate you entries via ','" @blur="validateInput"></textarea>
                        <p style="color: red;" v-if="inputValidity === 'invalid'">Please give me an input</p>
                    </div>
                </keep-alive>
                <br>
                <h4>Query Type</h4>
                <keep-alive>
                    <div class="form-control">
                        <input type="radio" id="query-genes" value="genes" name="query" v-model="queryType" />
                        <label for="query-genes">Genes</label>
                        <input type="radio" id="query-protein" value="protein" name="query" v-model="queryType" />
                        <label for="query-protein">Protein</label>
                        <input type="radio" id="query-article" value="article" name="query" v-model="queryType" />
                        <label for="query-article">Article</label>
                    </div>
                </keep-alive>
                <br>
                <div>
                    <base-button>Submit</base-button>
                </div>
            </form>
        </base-card>
        <base-card>
            <base-button @click="csv_test()">csv-test</base-button>
        </base-card>
    </section>
    <div v-if="isLoading">
        <base-card>
            <h1>The monkeys in the backroom are busy looking around...please be patient</h1>
        </base-card>
    </div>
    <base-card v-if="mydata">
        <base-button @click="downloadJSON">Download Data (JSON)</base-button>
        <base-button @click="csv_test">Download Data (CSV)</base-button>
        <h3>First 25 results:</h3>
        <div v-for="entry in mydata.slice(0,25)" :key="entry.ArticleTitle">
            <!-- <base-card> -->
            <p>Gene: {{entry.Sid}}</p>
            <p>Article: {{entry.ArticleTitle}}</p>
            <p>---</p>
            <!-- <h1>{{ mydata }}</h1> -->
            <!-- </base-card> -->
        </div>
    </base-card>
    <div v-if="resultsBack">
        <base-card>
            <h1>result</h1>
            <h2>{{ userInput }}</h2>
        </base-card>
    </div>
</template>

<script>
import BaseCard from '../UI/BaseCard.vue'
import BaseButton from '../UI/BaseButton.vue';
import BaseCard1 from '../UI/BaseCard.vue';
import BaseButton1 from '../UI/BaseButton.vue';
import exportFromJSON from "export-from-json"

export default {
    data() {
        return {
            userInput: "",
            queryType: null,
            resultsBack: false,
            isLoading: false,
            inputValidity: "pending",
            formInputIsInvalid: false,
            mydata: null,
            urlParameters: "",
            json_data: [
                {
                    "car": "Audi",
                    "price": 40000,
                    "color": "blue"
                }, {
                    "car": "BMW",
                    "price": 35000,
                    "color": "black"
                }, {
                    "car": "Porsche",
                    "price": 60000,
                    "color": "green"
                }
            ]
        };
    },
    methods: {
        gogoQuery() {
            this.resultsBack = false;
            this.mydata = null;
            const geneList = this.userInput.split(",");
            for (let i = 0; i < geneList.length; i++) {
                geneList[i] = geneList[i].trim();
                if (geneList[i].length === 0 || geneList[i].includes(" ")) {
                    geneList.splice(i, 1);
                }
            }
            if (this.userInput === "" || this.queryType === null) {
                this.formInputIsInvalid = true;
                return;
            }
            this.isLoading = true;
            if (this.queryType === "genes") {
                for (let i = 0; i < geneList.length; i++) {
                    this.urlParameters += "g=" + geneList[i];
                    if (i != geneList.length - 1) {
                        this.urlParameters += "&";
                    }
                }
                fetch("http://127.0.0.1:8000/genesbygenelist/?" + this.urlParameters).then((response) => {
                    if (response.ok) {
                        // console.log(response);
                        return response.json();
                    }
                }).then((data) => {
                    this.isLoading = false;
                    this.resultsBack = true;
                    this.mydata = data;
                });
                // console.log(typeof this.mydata)
                // console.log(this.mydata)
                //console.log(typeof this.mydata[0])
                this.urlParameters = "";
            }
            if (this.queryType === "protein") {
                fetch("http://127.0.0.1:8000/proteinbygenelist/?").then((response) => {
                    if (response.ok) {
                        // console.log(response);
                        return response.json();
                    }
                }).then((data) => {
                    this.isLoading = false;
                    this.resultsBack = true;
                    this.mydata = data;
                });
            }
            else if (this.queryType === "article") {
                for (let i = 0; i < geneList.length; i++) {
                    this.urlParameters += "g=" + geneList[i];
                    if (i != geneList.length - 1) {
                        this.urlParameters += "&";
                    }
                }
                fetch("http://127.0.0.1:8000/articlebygenelist/?" + this.urlParameters).then((response) => {
                    if (response.ok) {
                        // console.log(response)
                        return response.json();
                    }
                }).then((data) => {
                    this.isLoading = false;
                    this.resultsBack = true;
                    this.mydata = data;
                    // console.log("here is my data test " + this.mydata);
                });
                // console.log("here is my data " + this.mydata);
                this.urlParameters = "";
            }
        },
        validateInput() {
            if (this.userInput === "") {
                this.inputValidity = "invalid";
            }
            else {
                this.inputValidity = "valid";
            }
        },
        confirmError() {
            this.formInputIsInvalid = false;
        },
        getFileName() {
            if (!(this.userInput.split(',')[1] === undefined)) {
                return this.userInput.split(',')[0].trim() + ', ' + this.userInput.split(',')[1].trim()
            }
            else {
                return this.userInput.split(',')[0].trim()
            }
        },
        downloadJSON(contentType) {
            if (!contentType)
                contentType = "application/octet-stream";
            const obj = this.mydata;
            var a = document.createElement("a");
            var blob = new Blob([JSON.stringify(obj, null, 2)], { "type": contentType });
            a.href = window.URL.createObjectURL(blob);
            a.download = this.getFileName();
            a.click();
        },
        downloadCSV(contentType) {
            if (!contentType)
                contentType = "application/octet-stream";
            //const { Parser } = require('json2csv');
            const json2csvParser = new Parser();
            const obj = json2csvParser.parse(this.mydata);
            //const obj = this.mydata;
            var a = document.createElement("a");
            var blob = new Blob([JSON.stringify(obj, null, 2)], { "type": contentType });
            a.href = window.URL.createObjectURL(blob);
            a.download = this.getFileName();
            a.click();
        },
        csv_test() {
            const myCars = [
                {
                    "car": "Audi",
                    "price": 40000,
                    "color": "blue"
                }, {
                    "car": "BMW",
                    "price": 35000,
                    "color": "black"
                }, {
                    "car": "Porsche",
                    "price": 60000,
                    "color": "green"
                }
            ];

            const data = this.mydata
            const fileName = "csv-test"
            const exportType = exportFromJSON.types.csv;

            exportFromJSON({ data, fileName, exportType })
        }
    },
    components: { BaseCard, BaseButton, BaseCard1, BaseButton1 }
}
</script>

<style scoped>
.form-control {
    margin: 0.5rem 0;
}

input[type='text'] {
    display: block;
    width: 20rem;
    margin-top: 0.5rem;
}

.form-control.invalid textarea {
    border-color: red
}

.form-control.invalid label {
    color: red
}
</style>