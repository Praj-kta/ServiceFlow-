export const normalizeLocationText = (value?: string) =>
  (value || "").toString().trim().toLowerCase();

export const extractPincode = (value?: string) => {
  const match = (value || "").match(/\b\d{6}\b/);
  return match ? match[0] : "";
};

export const matchesPincode = (providerPincode: string, requestedPincode: string) =>
  !requestedPincode || providerPincode === requestedPincode;

export const matchesLocation = (
  providerAddress: string,
  serviceAreas: string[],
  requestedLocation: string,
) => {
  if (!requestedLocation) {
    return true;
  }

  const normalizedRequestedLocation = normalizeLocationText(requestedLocation);
  const normalizedAddress = normalizeLocationText(providerAddress);
  const normalizedAreas = serviceAreas.map(normalizeLocationText).filter(Boolean);

  return (
    normalizedAddress.includes(normalizedRequestedLocation) ||
    normalizedRequestedLocation.includes(normalizedAddress) ||
    normalizedAreas.some(
      (area) =>
        area.includes(normalizedRequestedLocation) ||
        normalizedRequestedLocation.includes(area),
    )
  );
};
