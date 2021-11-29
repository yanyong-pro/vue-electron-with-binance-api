<template>
    <v-form>
        <v-container>
            <v-row>
                <v-col
                    class="setting-icon-container mt-2 pb-0"
                    cols="12">
                    <v-icon
                        dark
                        class="setting-icon"
                        @click="$emit('go-to-setting')"
                        :disabled="disabledInput">
                        mdi-cog
                    </v-icon>
                </v-col>
            </v-row>
            <v-row>
                <v-col
                    cols="9">
                    <v-text-field
                        v-model.trim="newSymbol"
                        dark
                        label="Symbol"
                        :disabled="disabledInput"
                        @keyup="uppercaseSymbol()">
                    </v-text-field>
                </v-col>
                <v-col
                    cols="3">
                    <v-btn
                        dark
                        class="mt-3"
                        color="success"
                        width="100%"
                        :disabled="disabledAddingSymbol || disabledInput"
                        @click="addSymbol()">
                        Add
                    </v-btn>
                </v-col>
            </v-row>
            <v-row
                v-for="(symbol, indexSymbol) in symbols"
                :key="indexSymbol">
                <v-col
                    cols="4"
                    class="pb-0">
                    <div class="mt-4 d-flex">
                        <div class="symbol-text">
                            {{ symbol.name }}
                        </div>
                        <v-icon
                            color="white"
                            size="16px"
                            class="delete-btn"
                            :disabled="disabledInput"
                            @click="deleteSymbol(symbol.name)">
                            mdi-delete
                        </v-icon>
                    </div>
                </v-col>
                <v-col
                    cols="4"
                    class="pb-0">
                    <v-select
                        v-model="symbol.interval"
                        dark
                        :items="intervalItems"
                        :disabled="disabledInput"
                        label="Interval"
                    ></v-select>
                </v-col>
                <v-col
                    cols="4"
                    class="status-state-container pb-0">
                    <v-btn
                        dark
                        class="mt-3 status-state"
                        :color="getStatus(symbol.status)">
                        {{ symbol.status.toUpperCase() }}
                    </v-btn>
                </v-col>
                <v-row
                    v-for="(trigger, indexTrigger) in symbol.triggers"
                    :key="indexTrigger"
                    class="px-3">
                    <v-col
                        cols="4">
                        <v-btn
                            v-if="indexTrigger < 1"
                            @click="addTrigger(indexSymbol)"
                                dark
                                color="success"
                                :disabled="disabledInput">
                                + trigger
                            </v-btn>
                    </v-col>
                    <v-col
                        cols="3"
                        class="pt-0">
                        <v-text-field
                            v-model.number="trigger.price"
                            dark
                            label="Price"
                            placeholder="Price"
                            :disabled="disabledInput">
                        </v-text-field>
                    </v-col>
                    <v-col
                        cols="4"
                        class="pt-0">
                        <v-select
                            v-model="trigger.operation"
                            dark
                            :items="operationItems"
                            :disabled="disabledInput"
                            label="Operation"
                        ></v-select>
                    </v-col>
                    <v-col
                        cols="1">
                        <v-icon
                            v-if="indexTrigger > 0"
                            color="white"
                            size="16px"
                            class="delete-trigger-btn pt-2"
                            :disabled="disabledInput"
                            @click="deleteTrigger(indexSymbol, indexTrigger)">
                            mdi-delete
                        </v-icon>
                    </v-col>
                </v-row>
            </v-row>
            <v-row v-if="symbols.length">
                <v-col
                    cols="12"
                    class="start-stop-btn-container">
                    <v-btn
                        @click="toggleService()"
                        dark
                        :disabled="disabledStartOrStop"
                        :color="startOrStopColor">
                        {{ startOrStopText }}
                    </v-btn>
                </v-col>
            </v-row>
            <v-snackbar
                v-model="snackbar"
                :timeout="1500">
                Duplicated Symbol
                <template v-slot:action="{ attrs }">
                    <v-btn
                        color="blue"
                        text
                        v-bind="attrs"
                        @click="snackbar = false">
                        Close
                    </v-btn>
                </template>
            </v-snackbar>
        </v-container>
    </v-form>
</template>

<script>
export default {
    name: 'home',

    data () {
        return {
            snackbar: false,
            newSymbol: null,
            symbols: [],
            intervalItems: ['disabled', '30s'],
            operationItems: ['Greater Than', 'Less Than'],
            isConnecting: false
        }
    },

    computed: {
        disabledInput () {
            if (this.isConnecting) {
                return true
            }
            return false
        },

        disabledAddingSymbol () {
            if (this.newSymbol) {
                return false
            }

            return true
        },

        startOrStopText () {
            if (!this.isConnecting) {
                return 'Start'
            }

            return 'Stop'
        },

        startOrStopColor () {
            if (!this.isConnecting) {
                return 'success'
            }

            return 'red lighten-1'
        },

        disabledStartOrStop () {
            if (!this.symbols.length) {
                return true
            }

            return false
        }
    },

    methods: {
        addSymbol () {
            const found = this.symbols.find(symbol => symbol.name === this.newSymbol)
            if (found) {
                this.snackbar = true
                return
            }
            const newSymbol = {
                name: this.newSymbol,
                status: 'disconnected',
                interval: '30s',
                triggers: [
                    {
                        price: null,
                        operation: ''
                    }
                ]
            }

            this.symbols.push(newSymbol)

            this.newSymbol = null
        },

        uppercaseSymbol () {
            this.newSymbol = this.newSymbol.toUpperCase()
        },

        getStatus (status) {
            if (status === 'connected') {
                return 'success'
            }

            return 'red lighten-1'
        },

        deleteSymbol (name) {
            this.symbols = this.symbols.filter(symbol => symbol.name !== name)
        },

        setSymbolsStatus (status) {
            for (let i = 0; i < this.symbols.length; i++) {
                if (this.symbols[i].interval !== 'disabled') {
                    this.symbols[i].status = status
                }
            }
        },

        processSymbolsStatus () {
            if (this.isConnecting) {
                this.setSymbolsStatus('connected')
            } else {
                this.setSymbolsStatus('disconnected')
            }
        },

        addTrigger (indexSymbol) {
            this.symbols[indexSymbol].triggers.push({
                price: null,
                operation: ''
            })
        },

        deleteTrigger (indexSymbol, indexTrigger) {
            this.symbols[indexSymbol].triggers.splice(indexTrigger, 1)
        },

        async toggleService () {
            const form = {
                symbols: this.symbols,
                lineApiToken: this.$store.state.lineApiToken
            }
            const res = await this.axios.post('http://localhost:3001/update/notification', form)

            if (res && res.data && res.data.status === 'ok') {
                this.isConnecting = !this.isConnecting
                this.processSymbolsStatus()
            }
        }
    },

    mounted () {
        this.symbols = this.$store.state.symbols
        this.setSymbolsStatus('disconnected')
    },

    watch: {
        symbols: {
            deep: true,
            handler () {
                this.$store.dispatch('updateSymbols', this.symbols)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.status-state-container, .start-stop-btn-container {
    display: flex;
    justify-content: center;
}
.status-state {
    font-size: 10px !important;
}
.setting-icon-container {
    display: flex;
    justify-content: flex-end;
}
.setting-icon {
    cursor: pointer;
}
.delete-btn {
    cursor: pointer;
    margin-left: 0.6rem;
}
.delete-trigger-btn {
    cursor: pointer;
}
.symbol-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
