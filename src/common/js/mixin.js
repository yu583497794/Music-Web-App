// 增加代码的复用，和可维护性
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import { shuffle } from 'common/js/util'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  // dom ready后触发
  mounted () {
    this.handlePlaylist(this.playlist)
  },
  // keep-alive
  activated () {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist (newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist () {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'playlist',
      'currentSong',
      'mode'
    ])
  },
  methods: {
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = []
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    }),
    ...mapActions([
      'saveRecentPlaylist'
    ])
  }
}

export const searchListMixin = {
  data() {
    return {
      query: ''
    }
  },
  methods: {
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    onQueryChange(query) {
      this.query = query
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
      // console.log(this.searchHistory)
    },
    ...mapActions([
      'deleteSearchHistory'
    ])
  },
  computed: {
    ...mapGetters([
      'searchHistory',
      'saveSearchHistory'
    ])
  }
}

export const favoriteMixin = {
  methods: {
    favoriteCls(item) {
      const fIndex = this.likeList.findIndex((id) => {
        return id === item.id
      })
      return fIndex === -1 ? 'icon-not-favorite' : 'icon-favorite'
    },
    ...mapActions([
      'toggleLike'
    ])
  },
  computed: {
    ...mapGetters([
      'likeList'
    ])
  }
}