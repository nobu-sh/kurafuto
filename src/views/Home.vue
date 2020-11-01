<template>
  <div class="home">
    <Particles
      id="tsparticles"
      :options="{
        fpsLimit: 60,
        interactivity: {
          detectsOn: 'canvas',
          events: {
            onHover: {
              enable: true,
              mode: 'repulse'
            },
            resize: true
          },
          modes: {
            bubble: {
              distance: 400,
              duration: 2,
              opacity: 0.1,
              size: 40
            },
            push: {
              quantity: 4
            },
            repulse: {
              distance: 0,
              duration: 0.4
            }
          }
        },
        particles: {
          color: {
            value: '#C669FF'
          },
          links: {
            color: '#ffffff',
            distance: 150,
            enable: false,
            opacity: 0.05,
            width: 2
          },
          collisions: {
            enable: true
          },
          move: {
            direction: 'none',
            enable: true,
            outMode: 'bounce',
            random: false,
            speed: 1,
            straight: false
          },
          number: {
            density: {
              enable: true,
              value_area: 800
            },
            value: 80
          },
          opacity: {
            value: 0.5
          },
          shape: {
            type: 'circle'
          },
          size: {
            random: true,
            value: 2
          }
        },
        detectRetina: true
      }"
    />
    <div class="logincontainer">
      <div class="watermark" @click="redirect()">
        <p>github.com/NobUwU</p>
        <img src="../assets/github.png">
      </div>
      <div class="modal">
        <h1>Administrative Login</h1>
        <transition name="slide-fade">
          <div v-if="errmsg" class="errmsg">
            <p>{{ errmsg }}</p>
          </div>
        </transition>
        <div class="login">
          <div class="username loginmodal">
            <Icon>user</Icon>
            <input v-model="username" :disabled="isLoggingIn" v-on:keyup.enter.prevent="attemptLogin()" placeholder="Username">
          </div>
          <div class="password loginmodal">
            <Icon>padlock</Icon>
            <input v-model="password" :disabled="isLoggingIn" type="password" v-on:keyup.enter.prevent="attemptLogin()" placeholder="Password">
          </div>
          <div v-if="!isLoggingIn" :class="{'button': true}" @click="attemptLogin()">
            <p>Login</p>
          </div>
          <div v-else class="loading">
            <img src="@/assets/loading.gif">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '~mixins/breakpoints';
* {
  user-select: none;
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(-10px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
.loading {
  margin-top: 1.5rem;
  width: 25px;
  height: 25px;
  img {
    width: 25px;
    height: 25px;
  }
}
.errmsg {
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  width: 260px;
  padding: 5px 0px;
  p {
    text-align: center;
    background-color: rgba($color: #ff5757, $alpha: 0.4);
    font-size: 0.7rem;
    border-radius: 10px;
    width: 260px;
    padding: 3px 0px;
    position: relative;
    bottom: 1rem;
  }
}
  .home {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, rgba(40, 23, 48, 0) 0%, rgba(40, 23, 48, 0.802083) 0.01%, #281730 100%), url('../assets/main.png');
      #tsparticles {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .logincontainer {
        display: flex;
        flex-direction: row;
        position: relative;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        .watermark {
          display: flex;
          flex-direction: row;
          position: fixed;
          width: 140px;
          height: 25px;
          bottom: 5px;
          right: 10px;
          align-items: center;
          transition: transform ease 0.3s;
          img {
            width: 25px;
            height: 25px;
          }
          p {
            margin-right: 10px;
            font-size: 0.7rem;
            opacity: 0.8;
          }
          &:hover {
            cursor: pointer;
            transition: transform ease 0.3s;
            transform: scale(1.10);
          }
        }
        .modal {
          width: 700px;
          height: 280px;
          background-color: var(--accent);
          opacity: 0.6;
          border-radius: 5px;
          margin: 1rem;
          h1 {
            text-align: center;
            margin: 10px;
            opacity: 1;
            margin-top: 1rem;
          }
          .login {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 1rem;
            .button {
              padding: 8px 15px;
              background-color: rgba($color: #b145ff, $alpha: 0.6);
              margin-top: 1.4rem;
              border-radius: 5px;
              transition: all ease 0.2s;
              &:hover {
                cursor: pointer;
                transition: all ease 0.2s;
                transform: scale(1.05);
                background-color: rgba($color: #c473ff, $alpha: 0.6);
              }
            }
            .loginmodal {
              width: 90%;
              background-color: rgba(white, 0.035);
              display: flex;
              margin-bottom: 10px;
              align-items: center;
              transition: transform ease 0.2s;
              padding: 0.3rem;
              margin: 0.5rem;

              &:focus-within {
                outline: 1px solid rgba(white, 0.1);
                transition: transform ease 0.2s;
                transform: scale(1.02);
              }

              svg {
                height: 22px;
                padding: 0 8px;
                opacity: 09;
              }

              input {
                background-color: transparent;
                border: none;
                color: white;
                padding: 10px;
                padding-left: 0;
                flex-grow: 1;
                outline: none;
                font-size: 14px;
              }
            }
          }
          // @include md {
          //   width: 600px;
          //   height: 400px;
          // }
          // @include sm {
          //   width: 95%;
          //   height: 500px;
          // }
        }
      }
  }
</style>

<script>
  import Icon from '@/components/Icon'
  export default {
    components: {
      Icon,
    },
    data() {
      return {
        username: null,
        password: null,

        errmsg: null,
        isLoggingIn: false,
      }
    },
    methods: {
      redirect: function() {
        window.location.href = 'https://github.com/NobUwU'
      },
      attemptLogin: function() {
        if (!this.username || this.username === "") return this.showErr("Please specify a username to continue")
        if (!this.password || this.password === "") return this.showErr("Please specify a password to continue")
        this.isLoggingIn = true
        alert("Everything working as planned")
        // this.username = null
        // this.password = null
      },
      showErr: function(message) {
        this.errmsg = message
        setTimeout(() => {
          this.errmsg = null
        },10000)
      },
    },
  }
</script>
