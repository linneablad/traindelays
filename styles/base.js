import {  StyleSheet } from "react-native";

export const container = {
  flex: 1,
  color: '#333',
  backgroundColor: '#fff',
};

export const base = {
    paddingLeft: 12,
    paddingRight: 12,
    flex: 1,
};

export const centerHorisontal = {
    alignItems: 'center',
};

export const marginTop = {
    marginTop: 28,
};

export const marginBottom = {
    marginBottom: 28,
};

export const mapContainer = {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
}

export const map = {
    ...StyleSheet.absoluteFillObject,
}
