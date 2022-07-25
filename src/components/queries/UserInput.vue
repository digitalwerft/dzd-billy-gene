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
            <h2>DZD Query Machine (Aplha)</h2>
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

                    <h1>{{ isLoading }}</h1>
                </div>
            </form>
        </base-card>
    </section>
    <div v-if="isLoading">
        <base-card>
            <h1>The monkeys in the backroom are busy looking around...please be patient</h1>
        </base-card>
    </div>
    <div v-if="resultsBack">
        <base-card>
            <h1>result</h1>
        </base-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            userInput: '',
            queryType: null,
            resultsBack: false,
            isLoading: false,
            inputValidity: 'pending',
            formInputIsInvalid: false
        }
    },
    methods: {
        gogoQuery() {
            this.isLoading = true
            console.log('always')

            if (this.userInput === '' || this.queryType === null) {
                this.formInputIsInvalid = true
                console.log(this.formInputIsInvalid)
                return;
            }

            console.log("never")
            this.isLoading = false
            this.resultsBack = true
        },
        validateInput() {
            if (this.userInput === '') {
                this.inputValidity = 'invalid'
            } else {
                this.inputValidity = 'valid'
            }
        },
        confirmError() {
            this.formInputIsInvalid = false
        }
    }

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