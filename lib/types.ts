export type VideoItem = {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
  createdBy?: string;
};

export type UserRecord = {
  name: string;
  email: string;
  password: string;
};

export type CurrentUser = {
  name: string;
  email: string;
  isAdmin?: boolean;
};

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};
