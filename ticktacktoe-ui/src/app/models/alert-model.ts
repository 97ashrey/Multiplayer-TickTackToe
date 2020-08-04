import { AlertType } from '../types/alert-type';

export interface AlertModel {
    type: AlertType;
    text: string;
}