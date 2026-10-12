export const publicUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.passwordHash;
  return obj;
};
export const normalize = (s = "") => String(s).trim().toLowerCase();
export const skillScore = (me, other) => {
  const offered = (me.skillsOffered || []).map(normalize);
  const wanted = (me.skillsWanted || []).map(normalize);
  const otherOffered = (other.skillsOffered || []).map(normalize);
  const otherWanted = (other.skillsWanted || []).map(normalize);
  const teachesMe = otherOffered.filter(s => wanted.includes(s)).length;
  const ITeachThem = offered.filter(s => otherWanted.includes(s)).length;
  const total = teachesMe + ITeachThem;
  return { score: Math.min(100, total * 35 + (teachesMe && ITeachThem ? 20 : 0)), teachesMe, ITeachThem };
};
