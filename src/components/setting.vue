<template>
    <v-form>
        <v-container>
            <v-row>
                <v-col
                    class="mt-2 pb-0"
                    cols="12">
                    <v-icon
                        dark
                        class="back-icon"
                        @click="$emit('go-to-home')">
                        mdi-arrow-left
                    </v-icon>
                </v-col>
            </v-row>
            <v-row>
                <v-col
                    cols="12">
                    <v-text-field
                        v-model.trim="lineApiToken"
                        dark
                        label="Line API Token"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col
                    cols="12"
                    class="save-container">
                    <v-btn
                        dark
                        color="success"
                        @click="save()"
                        :disabled="disabledSave">
                        Save
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script>
export default {
    name: 'setting',

    computed: {
        disabledSave () {
            if (this.lineApiToken) {
                return false
            }

            return true
        }
    },

    data () {
        return {
            lineApiToken: ''
        }
    },

    methods: {
        save () {
            const payload = {
                lineApiToken: this.lineApiToken
            }

            this.$store.dispatch('updateSetting', payload)
        }
    },

    mounted () {
        this.lineApiToken = this.$store.state.lineApiToken
    }
}
</script>

<style lang="scss" scoped>
.save-container {
    display: flex;
    justify-content: center;
}
</style>
