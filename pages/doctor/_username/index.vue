<template>
    <section class="users-view">
        <div class="content">
            <div class="subsection">
                <span class="subsection-title" style="vertical-align: middle;">{{ user.patientname }}</span>
            </div>
            <div class="subsection">
                <div style="margin: 25px 10px;">
                    <span class="subsection-title" style="vertical-align: middle;">Create Referral</span>
                </div>
                <form style="margin: 15px 15px;">
                    <div style="margin: 10px 0;">
                        <span class="referral-patientid">Patient ID: </span>
                        <input type="number" v-model="patientid"/>
                    </div>
                    <span class="referral-rdoctorid">Referral Doctor: </span>
                    <select v-model="referraldoctorid">
                        {{doctors[0].doctorname}}
                        <option disabled value="">Please select one</option>
                        <option v-for="doctor in doctors" v-bind:value="doctor.doctorid">
                            {{doctor.doctorname}}
                        </option>
                    </select>
                    <div style="margin: 10px 0;">
                        <span class="referral-referraldate">Referral Date: </span>
                        <input type="date" v-model="referralDate"/>
                    </div>
                </form>
                <button type="button" class="button--grey" @click="submitInsert">Add Referral</button>
            </div>

            <div class="subsection">
                <div class="links">
                    <nuxt-link class="button--grey link" style="margin-left: 15px;" :to="{ path: `/doctor/${user.patientid}/medrec`, params: { username: user.patientname, id: user.patientid }}">
                       Medical Record
                    </nuxt-link>
                    <nuxt-link class="button--grey link" style="margin-left: 15px;" :to="{ path: `/doctor/${user.patientid}/prescription`, params: { username: user.patientname, patientid: user.patientid }}">Prescriptions</nuxt-link>
                    <nuxt-link class="button--grey link" style="margin-left: 15px;" :to="{ path: `/doctor/${user.patientid}/appointment`, params: { username: user.patientname, patientid: user.patientid }}">Appointments</nuxt-link>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import axios from '~/plugins/axios'

    export default {
      data () {
        return {
          patientid: '',
          referraldoctorid: '',
          referralDate: '',
          doctors: {}
        }
      },

      created: function () {
        this.patientid = this.$route.params.username
      },
      methods: {
        submitInsert () {
          let self = this

          axios.post('/api/doctor/addRef', {
            headers:
                        {
                          'Content-Type': 'application/json'
                        },
            data:
                        {
                          patientid: self.patientid,
                          referraldoctorid: self.referraldoctorid,
                          referralDate: self.referralDate
                        }})
            .then((res) => {
              // res.data should contain the url for redirecting... bad practice
              self.$nuxt.$router.replace({ path: res.data })
            })
            .catch((e) => {
              console.log(e)
            })
        }
      },
      name: 'username',
      async asyncData ({ params, error }) {
        let doctorData = await axios.get('/api/doctors')
        return axios.get('/api/doctor/' + params.username)
          .then((res) => {
            return { user: res.data, doctors: doctorData.data }
          })
          .catch((e) => {
            error({ statusCode: 404, message: 'User not found' })
          })
      },
      head () {
        return {
          title: `User: ${this.user.username}`
        }
      }
    }
</script>

<style lang="stylus" scoped>
    .users-view
        padding-top 0

    .content
        position absolute
        width 100%

    .subsection
        background-color #fff
        border-radius 2px
        margin 25px 0
        transition all .5s cubic-bezier(.55,0,.1,1)
        padding 10px 30px 10px 30px
        position relative
        line-height 20px
        .subsection-title
            font-size 26px
            font-weight 500
        .title
            font-size 18px
            font-weight 500
        a
            text-decoration underline
            &:hover
                color #515ec4

</style>