import React from "react";
import { shallow } from "enzyme";
import App from "../App.js";
import Constants from "../constants";

describe("App", () => {
  let component = "";

  beforeAll(() => {
    component = shallow(<App />);
  });

  it("should render my app", () => {
    expect(component.getElements()).toMatchSnapshot();
  });

  it("fetches data from server when server returns a successful response", done => {
    const mockSuccessResponse = {};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse);
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise
    });
    jest.spyOn(global, "fetch").mockImplementation(() => mockFetchPromise);
    shallow(<App />);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(Constants.API_URL);

    process.nextTick(() => {
      expect(component.state()).toEqual({
        cards: [],
        errorVisible: false,
        message: ""
      });
      global.fetch.mockClear();
      done();
    });
  });

  it("should show error on invalid card", () => {
    const mockData = {
      name: "test",
      cardNumber: "765757577",
      limit: 12
    };
    component.instance().checkValidation(mockData);
    expect(component.state().errorVisible).toEqual(true);
    expect(component.state().message).toEqual(Constants.INVALID_CARD);
  });

  it("should show error on invalid limit", () => {
    const mockData = {
      name: "test",
      cardNumber: "0437093859",
      limit: -12
    };
    component.instance().checkValidation(mockData);
    expect(component.state().errorVisible).toEqual(true);
    expect(component.state().message).toEqual(Constants.INVALID_LIMIT);
  });
});
