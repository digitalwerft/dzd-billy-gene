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
            <form @submit.prevent="gogoQuery">
                <keep-alive>
                    <div class="form-control" :class="{ invalid: inputValidity === 'invalid' }">
                        <label for="input">
                            <h4> Your Input: </h4>
                        </label>
                        <textarea id="input" class="form__control" name="input" v-model.trim="userInput" rows="6" cols="33"
                            placeholder="Please seperate you entries via ','" @blur="validateInput"></textarea>
                        <p style="color: red;" v-if="inputValidity === 'invalid'">Please give me an input</p>
                    </div>
                </keep-alive>
                <keep-alive>
                    <div>
                        <label for="input">
                            <h4> MeSH-Terms: </h4>

                            <div class="form__group">
                                <div class="radio__group radio__group--inline">
                                    <div class="radio">
                                        <input 
                                        type="radio" 
                                        class="radio__input" 
                                        value="and_mesh" 
                                        id="mesh-combined"
                                        v-model="meshQueryType" 
                                        checked />
                                        <label for="mesh-combined"><span>Combined MeSH-Terms</span></label>
                                    </div>

                                    <div class="radio">
                                        <input 
                                        type="radio" 
                                        class="radio__input"
                                        value="or_mesh" 
                                        id="mesh-separate"
                                        v-model="meshQueryType" />
                                        <label for="mesh-separate"><span>Separate MeSH-Terms</span></label>
                                    </div>
                                </div>
                            </div>
                        </label>

                        <MeshTerm ref="meshTerms"></MeshTerm>
                        <!--{{ $refs.meshTerms.selected }}-->


                        <!--textarea id="meshTerms" class="form__control" name="meshTerms" v-model.trim="meshTerms" rows="6" cols="33"
                            placeholder="Please seperate you entries via ','"></textarea-->
                        <label for="input">
                            <h4> Blocklist: </h4>
                        </label>

                        <MeshTerm ref="blockList"></MeshTerm>
                        <!--{{ $refs.blockList.selected }}-->

                        <!--textarea id="blockList"  class="form__control" name="blockList" v-model.trim="blockList" rows="6" cols="33"
                            placeholder="Please seperate you entries via ','"></textarea-->
                    </div>
                </keep-alive>
                <br>
                <div>
                    <base-button>Submit</base-button>
                </div>
            </form>
        </base-card>
    </section>
    <base-dialog-no-button v-if="isLoading" title="Loading">
        <template #default>
            <h3>The monkeys in the backroom are busy looking around...please be patient</h3>
            <div style="text-align: center;" class="loader"></div>
        </template>
    </base-dialog-no-button>
    <base-card v-if="mydata && validResult">
        <base-button @click="downloadJSON">Download Data (JSON)</base-button>

        <base-button style="float: right">
            <download-csv :data="this.mydata" delimiter=";" :name="getName()">
                Download CSV
            </download-csv>
        </base-button>

        <!-- <base-button @click="downloadCSV" style="float: right">Download Data (CSV)</base-button> -->
        <h3>First 10 results:</h3>
        <div v-for="entry in mydata.slice(0, 10)" :key="entry.ArticleTitle">
            <p>Gene: {{ entry.Sid }}</p>
            <p>Article: {{ entry.ArticleTitle }}</p>
            <p>---</p>

        </div>
    </base-card>
    <div v-if="!validResult">
        <base-card>
            <h2>There was no result for your input:</h2>
            <h4>{{ userInput }}</h4>
        </base-card>
    </div>
    <div v-if="resultsBack && validResult">
        <base-card>
            <h1>Gene List</h1>
            <h2>{{ userInput }}</h2>
        </base-card>
    </div>
    <!-- <div v-if="resultsBack && validResult">
        <base-card>
            <p>{{ meshQueryType }}</p>
        </base-card>
    </div> -->
</template>

<script>
import BaseCard from '../UI/BaseCard.vue'
import BaseButton from '../UI/BaseButton.vue';
import BaseDialogNoButton from "../UI/BaseDialogNoButton.vue"
import MeshTerm from '../UI/MeshTerm.vue'
import exportFromJSON from "export-from-json"

export default {
    data() {
        return {
            userInput: "",
            meshTerms: [],
            blockList: "",
            queryType: "genes",
            meshQueryType: "and_mesh",
            resultsBack: false,
            isLoading: false,
            inputValidity: "pending",
            formInputIsInvalid: false,
            mydata: null,
            urlParameters: "",
            validResult: true,
            fileName: "",
            query: ""
        };
    },
    methods: {
        gogoQuery() {
            console.log(this.meshQueryType)
            this.resultsBack = false;
            this.mydata = null;
            this.validResult = true
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

            ////
            // Gene Query
            ////
            
            // get meshList and blockList from child components via $ref
            var meshList = this.$refs.meshTerms.selected;
            var blockList = this.$refs.blockList.selected;

            if (this.queryType === "genes") {
                this.urlParameters += "mqt=" + this.meshQueryType + "&"
                for (let i = 0; i < geneList.length; i++) {
                    this.urlParameters += "g=" + geneList[i];
                    if (i != geneList.length - 1) {
                        this.urlParameters += "&";
                    }
                }
                for (let i = 0; i < meshList.length; i++) {
                    this.urlParameters += "&m=" + meshList[i];
                }

                for (let i = 0; i < blockList.length; i++) {
                    this.urlParameters += "&b=" + blockList[i];
                }

                //http://127.0.0.1:8000/articlebygenelist/?
                //https://restapi.connect.dzd-ev.de/genesbygenelist/?
                fetch("https://restapi.connect.dzd-ev.de/genesbygenelist/?" + this.urlParameters).then((response) => {
                    if (response.ok) {
                        // console.log(response);
                        return response.json();
                    }
                }).then((data) => {
                    if (data.length === 0) {
                        this.validResult = false
                    }
                    this.isLoading = false;
                    this.resultsBack = true;
                    this.mydata = data;
                });

                this.urlParameters = "";
            }

            ////
            // Protein Query
            ////

            if (this.queryType === "protein") {
                fetch("https://restapi.connect.dzd-ev.de/proteinbygenelist/?").then((response) => {
                    if (response.ok) {
                        // console.log(response);
                        return response.json();
                    }
                }).then((data) => {
                    if (data.length === 0) {
                        this.validResult = false
                    }
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
                fetch("https://restapi.connect.dzd-ev.de/articlebygenelist/?" + this.urlParameters).then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                }).then((data) => {
                    this.isLoading = false;
                    this.resultsBack = true;
                    this.mydata = data;

                    if (data.length === 0) {
                        this.validResult = false
                    }

                });
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
        downloadJSON(contentType) {
            if (!contentType)
                contentType = "application/octet-stream";
            const obj = this.mydata;
            var a = document.createElement("a");
            var blob = new Blob([JSON.stringify(obj, null, 2)], { "type": contentType });
            a.href = window.URL.createObjectURL(blob);
            // Name transformation
            a.download = new Date().toISOString().split('.')[0] + this.meshQueryType

            a.click();
        },
        getName() {
            const fileName = new Date().toISOString().split('.')[0] + this.meshQueryType
            return fileName
        },
    },
    components: { BaseCard, BaseButton, BaseDialogNoButton, MeshTerm }
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

.loader {
    border: 16px solid #f3f3f3;
    border-radius: 50%;
    border-top: 16px solid #e42010;
    border-bottom: 16px solid #e42010;
    width: 120px;
    height: 120px;
    -webkit-animation: spin 2s linear infinite;
    animation: spin 2s linear infinite;
}

@-webkit-keyframes spin {
    0% {
        -webkit-transform: rotate(0deg);
    }

    100% {
        -webkit-transform: rotate(360deg);
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>