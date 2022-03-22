export function isUser(user) {
  return user.role === 'User';
}

export function isAdmin(user) {
  return user.role === 'Admin';
}

export function isCommitteMember(user) {
  return user.role === 'ComitteMemeber';
}
