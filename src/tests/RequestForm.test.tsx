import { render, screen, waitFor, within } from "@testing-library/react";
import RequestForm from "../components/RequestForm";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { BrowserRouter } from "react-router-dom";
import { expect, test, vi, describe } from "vitest";
import userEvent from "@testing-library/user-event";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("RequestForm", () => {
  function setup() {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <RequestForm />
        </BrowserRouter>
      </Provider>
    );
  }

  test("renders the form and shows all fields", () => {
    setup();

    expect(screen.getByLabelText(/Full Name:/i));
    expect(screen.getByLabelText(/Email:/i));
    expect(screen.getByText(/Issue Type:/i));
    expect(screen.getByLabelText(/Tags:/i));
    expect(screen.getByText(/Reproduce Step/i));
    expect(screen.getByRole("button", { name: /submit/i }));
  });

  test("shows validation errors if required fields are empty", async () => {
    setup();
    const submitContainer = document.querySelector(
      ".form-submit"
    ) as HTMLElement;
    const submitButton = within(submitContainer).getByRole("button", {
      name: /submit/i,
    });

    // Click submit immediately
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Full name is required/i));
      expect(screen.getByText(/Invalid email address/i));
      expect(screen.getByText(/Issue type is required/i));
      expect(screen.getByText(/Reproduce step is required/i));
    });
  });

  test("shows error for invalid email", async () => {
    setup();

    await userEvent.type(screen.getByLabelText(/Full Name:/i), "Jane Done");
    await userEvent.type(screen.getByLabelText(/Email:/i), "placeholder");

    // Select an issue type (simulate react-select)
    const issueContainer = document.querySelector(
      ".form-issue-type"
    ) as HTMLElement;
    const issueSelect = within(issueContainer).getByText("Select...");
    userEvent.click(issueSelect);

    const bugOption = await screen.findByText("Bug Report");
    await userEvent.click(bugOption);
    const stepInput = screen.getByLabelText(/Reproduce Step/i);
    await userEvent.clear(stepInput);
    await userEvent.type(stepInput, "Step 1");

    const submitContainer = document.querySelector(
      ".form-submit"
    ) as HTMLElement;
    const submitButton = within(submitContainer).getByRole("button", {
      name: /submit/i,
    });

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Full name is required/i)).toBeNull();
      expect(screen.getByText(/Invalid email address/i));
      expect(screen.queryByText(/Issue type is required/i)).toBeNull();
      expect(
        screen.queryByText(/At least one reproduce step is required/i)
      ).toBeNull();
    });
  });

  test("submits successfully with valid data", async () => {
    setup();

    await userEvent.type(screen.getByLabelText(/Full Name/i), "Jane Doe");
    await userEvent.type(
      screen.getByLabelText(/Email/i),
      "jane.doe@example.com"
    );

    const bugOption = await screen.findByText("Bug Report");
    await userEvent.click(bugOption);
    // Reproduce steps default exist, fill the first one
    const stepInput = screen.getByLabelText(/Reproduce Step/i);
    await userEvent.clear(stepInput);
    await userEvent.type(stepInput, "Step 1");

    // Submit
    const submitContainer = document.querySelector(
      ".form-submit"
    ) as HTMLElement;
    const submitButton = within(submitContainer).getByRole("button", {
      name: /submit/i,
    });

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/confirmation");
    });
  });
});
