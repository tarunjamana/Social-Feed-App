import React from "react";

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  isLoading?: boolean;
  variant?: "primary" | "secondary";
}

export interface InputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}


export interface TextAreaProps{
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  rows?:number
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
}