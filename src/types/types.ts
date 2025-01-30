// src/types/api.ts
export interface ApiError {
  errors: string[];
}

export interface UserProfile {
  user: {
    username: string;
    user_id: number;
    user_message_count: number;
    user_like_count: number;
    user_like2_count: number;
    contest_count: number;
    trophy_count: number;
    user_following_count: number;
    user_followers_count: number;
    balance: string | number;
    joined_date: number;
    links: {
      avatar: string;
    };
  };
}

export interface TransferFundsParams {
  username: string;
  amount: string;
  secretAnswer: string;
  comment?: string;
  isHoldEnabled: boolean;
  holdLength?: string;
  holdOption?: string;
}

export interface BaseQueryParams {
  username: string;
  amount: string;
  currency: string;
  secret_answer: string;
  transfer_hold: string;
  comment?: string;
  hold_length_value?: string;
  hold_length_option?: string;
}

export type HttpQueryParams = {
  [K in keyof BaseQueryParams]: string;
};
