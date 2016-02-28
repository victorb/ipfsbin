export function ChangeText (text) {
  return {
    type: 'CHANGE_TEXT',
    text
  }
}

export function ChangeMode (mode) {
  return {
    type: 'CHANGE_MODE',
    mode
  }
}

export function ChangeLocal (local) {
  return {
    type: 'CHANGE_LOCAL',
    local
  }
}

export function Save () {
  return {
    type: 'SAVE'
  }
}

export function Saved (hash) {
  return {
    type: 'SAVED',
    hash
  }
}

export function Reset () {
  return {
    type: 'RESET'
  }
}
