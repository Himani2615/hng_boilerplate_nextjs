import { render, screen, fireEvent, waitFor, getByLabelText } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import Preferences from './Preferences';

// Mock data
const languageOptions = [
  "Italiano(Italian)",
  "Español (Spanish)",
  "Français (French)",
  "Deutsch (German)",
  "English",
  "日本語 (Japanese)",
  "한국어 (Korean)",
  "Русский (Russian)",
  "العربية (Arabic)",
];

const regionOptions = [
  "France",
  "Canada",
  "United Kingdom",
  "Germany",
  "United States",
  "Japan",
  "South Korea",
  "Russia",
  "United Arab Emirates"
];

const timeZoneOptions = [
  "(UTC-08:00) Pacific",
  "(UTC-07:00) Mountain",
  "(UTC-06:00) Central",
  "(UTC-05:00) Eastern",
  "(UTC-04:00) Atlantic",
  "(UTC+00:00) Co-ord",
  "(UTC+08:00) Beijing",
];

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ message: 'Settings have been saved successfully.' }),
  } as Response)
);

describe('Preferences Component', () => {
  it('renders the component with default values', () => {
    render(<Preferences />);

    expect(screen.getByText('Language & Region')).toBeInTheDocument();
    expect(screen.getByText('Customize your language and region preferences')).toBeInTheDocument();
    expect(screen.getByLabelText('Language')).toBeInTheDocument();
    expect(screen.getByLabelText('Region')).toBeInTheDocument();
    expect(screen.getByLabelText('Time-Zone')).toBeInTheDocument();
    expect(screen.getByLabelText('Save')).toBeInTheDocument();
    expect(screen.getByLabelText('Cancel')).toBeInTheDocument();
  });

  it('changes language selection', () => {
    render(<Preferences />);

    const languageTrigger = screen.getByLabelText("Language");
    fireEvent.click(languageTrigger);
    const option = screen.getByRole('option', { name: languageOptions[0] })
    fireEvent.click(option);

    expect(languageTrigger).toHaveTextContent(languageOptions[0]);

  });

  it('changes region selection', () => {
    render(<Preferences />);

    const regionTrigger = screen.getByLabelText("Region");
    fireEvent.click(regionTrigger);

    const option = screen.getByText(regionOptions[1]);
    fireEvent.click(option);

    expect(regionTrigger).toHaveTextContent(regionOptions[1]);
  });

  it('changes time zone selection', () => {
    render(<Preferences />);

    const timeZoneTrigger = screen.getByLabelText("Time-Zone");
    fireEvent.click(timeZoneTrigger);

    const option = screen.getByText(timeZoneOptions[1]);
    fireEvent.click(option);

    expect(timeZoneTrigger).toHaveTextContent(timeZoneOptions[1]);
  });

  it('displays error message when language is empty and submitting', async () => {
    render(<Preferences />);

    const regionTrigger = screen.getByLabelText("Region");
    const timeZoneTrigger = screen.getByLabelText("Time-Zone");

    // Set valid values for region and timezone
    fireEvent.click(regionTrigger);
    fireEvent.click(screen.getByText(regionOptions[1]));
    
    fireEvent.click(timeZoneTrigger);
    fireEvent.click(screen.getByText(timeZoneOptions[1]));

    // Submit with empty language
    const saveButton = screen.getByLabelText("Save");
    fireEvent.click(saveButton);

    const errorMessage = await screen.findByText('There was a problem updating your Language. Please try again.');
    expect(errorMessage).toBeInTheDocument();
  });

  it('displays error message when region is empty and submitting', async () => {
    render(<Preferences />);

    const languageTrigger = screen.getByLabelText("Language");
    const timeZoneTrigger = screen.getByLabelText("Region");

    // Set valid values for language and timezone
    fireEvent.click(languageTrigger);
    fireEvent.click(screen.getByText(languageOptions[1]));

    fireEvent.click(timeZoneTrigger);
    fireEvent.click(screen.getByText(timeZoneOptions[1]));

    // Submit with empty region
    const saveButton = screen.getByLabelText("Save");
    fireEvent.click(saveButton);

    const errorMessage = await screen.findByText('There was a problem updating your Region. Please try again.');
    expect(errorMessage).toBeInTheDocument();
  });

  it('displays error message when time-zone is empty and submitting', async () => {
    render(<Preferences />);

    const languageTrigger = screen.getByLabelText("Language")
    const regionTrigger = screen.getByLabelText("Region");

    // Set valid values for language and region
    fireEvent.click(languageTrigger);
    fireEvent.click(screen.getByText(languageOptions[1]));

    fireEvent.click(regionTrigger);
    fireEvent.click(screen.getByText(regionOptions[1]));

    // Submit with empty time-zone
    const saveButton = screen.getByLabelText("Save");
    fireEvent.click(saveButton);

    const errorMessage = await screen.findByText('There was a problem updating your Time-Zone. Please try again.');
    expect(errorMessage).toBeInTheDocument();
  });

  it('displays success message on valid submit', async () => {
    render(<Preferences />);

    const languageTrigger = screen.getByLabelText("Language");
    const regionTrigger = screen.getByLabelText("Region");
    const timeZoneTrigger = screen.getByLabelText("TimeZone");

    fireEvent.click(languageTrigger);
    fireEvent.click(screen.getByText(languageOptions[1]));

    fireEvent.click(regionTrigger);
    fireEvent.click(screen.getByText(regionOptions[1]));

    fireEvent.click(timeZoneTrigger);
    fireEvent.click(screen.getByText(timeZoneOptions[1]));

    const saveButton = screen.getByLabelText("Save");
    fireEvent.click(saveButton);

    const successMessage = await screen.findByText('Settings have been saved successfully.');
    expect(successMessage).toBeInTheDocument();
  });

  it('displays error message on failed submit', async () => {
    // Mock fetch to return an error response
    global.fetch = vi.fn(() =>
      Promise.reject({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Error updating settings. Please try again.' }),
      } as Response)
    );

    render(<Preferences />);

    const languageTrigger = screen.getByLabelText("Language");
    const regionTrigger = screen.getByLabelText("Region");
    const timeZoneTrigger = screen.getByLabelText("Time-Zone");

    fireEvent.click(languageTrigger);
    fireEvent.click(screen.getByText(languageOptions[1]));

    fireEvent.click(regionTrigger);
    fireEvent.click(screen.getByText(regionOptions[1]));

    fireEvent.click(timeZoneTrigger);
    fireEvent.click(screen.getByText(timeZoneOptions[1]));

    const saveButton = screen.getByLabelText("Save");
    fireEvent.click(saveButton);

    const errorMessage = await screen.findByText('Error updating settings. Please try again.');
    expect(errorMessage).toBeInTheDocument();
  });

  it('resets fields on cancel', () => {
    render(<Preferences />);

    const languageTrigger = screen.getByLabelText("Language");
    fireEvent.click(languageTrigger);
    fireEvent.click(screen.getByText(languageOptions[1],{exact:false}));
    

    const regionTrigger = screen.getByLabelText("Region");
    fireEvent.click(regionTrigger);
    fireEvent.click(screen.getByText(regionOptions[1]));

    const timeZoneTrigger = screen.getByLabelText("Time-Zone");
    fireEvent.click(timeZoneTrigger);
    fireEvent.click(screen.getByText(timeZoneOptions[1]));

    const cancelButton = screen.getByLabelText("Cancel");
    fireEvent.click(cancelButton);

    expect(languageTrigger).toHaveTextContent("");
    expect(regionTrigger).toHaveTextContent("");
    expect(timeZoneTrigger).toHaveTextContent("");
  });
});