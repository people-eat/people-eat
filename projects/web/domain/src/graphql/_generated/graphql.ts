/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: { input: string; output: string; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: Date; output: Date; }
  /** A field whose value conforms to the standard internet email address format as specified in HTML Spec: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address. */
  EmailAddress: { input: string; output: string; }
  /** A field whose value is a valid decimal degrees latitude number (53.471): https://en.wikipedia.org/wiki/Latitude */
  Latitude: { input: number; output: number; }
  /** A field whose value is a valid decimal degrees longitude number (53.471): https://en.wikipedia.org/wiki/Longitude */
  Longitude: { input: number; output: number; }
  /** A field whose value conforms to the standard E.164 format as specified in: https://en.wikipedia.org/wiki/E.164. Basically this is +17895551234. */
  PhoneNumber: { input: string; output: string; }
  /** A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt. */
  URL: { input: string; output: string; }
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  UUID: { input: string; output: string; }
  /** Integers that will have a value of 0 or more. */
  UnsignedInt: { input: number; output: number; }
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: File; output: File; }
};

export type Address = {
  __typename?: 'Address';
  addressId: Scalars['String']['output'];
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  houseNumber: Scalars['String']['output'];
  location: Location;
  postCode: Scalars['String']['output'];
  street: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type Admin = {
  __typename?: 'Admin';
  adminId: Scalars['String']['output'];
  user: PublicUser;
};

export type AdminMutation = {
  __typename?: 'AdminMutation';
  createOne: Scalars['Boolean']['output'];
  unlockBookingRequestPayment: Scalars['Boolean']['output'];
};


export type AdminMutationCreateOneArgs = {
  request: CreateOneAdminRequest;
};


export type AdminMutationUnlockBookingRequestPaymentArgs = {
  bookingRequestId: Scalars['String']['input'];
};

export type AdminQuery = {
  __typename?: 'AdminQuery';
  findMany: Array<Admin>;
  findOne?: Maybe<Admin>;
};


export type AdminQueryFindManyArgs = {
  request?: InputMaybe<FindManyRequest>;
};


export type AdminQueryFindOneArgs = {
  adminId: Scalars['String']['input'];
};

export type Allergy = {
  __typename?: 'Allergy';
  allergyId: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type AllergyMutation = {
  __typename?: 'AllergyMutation';
  createOne: Scalars['Boolean']['output'];
};

export type AllergyQuery = {
  __typename?: 'AllergyQuery';
  findAll: Array<Allergy>;
};

export type AnonymousSession = {
  __typename?: 'AnonymousSession';
  anonymousUser?: Maybe<AnonymousUser>;
  platform: Platform;
  sessionId: Scalars['String']['output'];
  userId?: Maybe<Scalars['String']['output']>;
};

export type AnonymousUser = {
  __typename?: 'AnonymousUser';
  birthDate?: Maybe<Scalars['Date']['output']>;
  createdAt: Scalars['DateTime']['output'];
  gender: Gender;
  language: UserLanguage;
};

export type BookingRequest = {
  __typename?: 'BookingRequest';
  adultParticipants: Scalars['UnsignedInt']['output'];
  allergies: Array<Allergy>;
  bookingRequestId: Scalars['String']['output'];
  children: Scalars['UnsignedInt']['output'];
  configuredMenu?: Maybe<ConfiguredMenu>;
  cook: PublicCook;
  cookAccepted?: Maybe<Scalars['Boolean']['output']>;
  cookId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  dateTime: Scalars['DateTime']['output'];
  duration: Scalars['UnsignedInt']['output'];
  globalBookingRequestId?: Maybe<Scalars['String']['output']>;
  kitchenId?: Maybe<Scalars['String']['output']>;
  location: Location;
  message: Scalars['String']['output'];
  occasion: Scalars['String']['output'];
  preparationTime: Scalars['UnsignedInt']['output'];
  price: Price;
  status: BookingRequestStatus;
  user: PublicUser;
  userAccepted?: Maybe<Scalars['Boolean']['output']>;
  userId: Scalars['String']['output'];
};

export type BookingRequestQuery = {
  __typename?: 'BookingRequestQuery';
  findMany?: Maybe<Array<BookingRequest>>;
  findOne?: Maybe<BookingRequest>;
};


export type BookingRequestQueryFindOneArgs = {
  bookingRequestId: Scalars['String']['input'];
};

export type BookingRequestStatus =
  | 'CANCELED'
  | 'COMPLETED'
  | 'OPEN'
  | 'PENDING';

export type Category = {
  __typename?: 'Category';
  categoryId: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type CategoryMutation = {
  __typename?: 'CategoryMutation';
  createOne: Scalars['Boolean']['output'];
};

export type CategoryQuery = {
  __typename?: 'CategoryQuery';
  findAll: Array<Category>;
};

export type ChatMessage = {
  __typename?: 'ChatMessage';
  bookingRequestId: Scalars['String']['output'];
  chatMessageId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type ConfiguredMenu = {
  __typename?: 'ConfiguredMenu';
  bookingRequestId: Scalars['String']['output'];
  courses: Array<ConfiguredMenuCourse>;
  description: Scalars['String']['output'];
  greetingFromKitchen?: Maybe<Scalars['String']['output']>;
  kitchenId?: Maybe<Scalars['String']['output']>;
  menuId?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type ConfiguredMenuCourse = {
  __typename?: 'ConfiguredMenuCourse';
  index: Scalars['UnsignedInt']['output'];
  mealDescription: Scalars['String']['output'];
  mealImageUrl?: Maybe<Scalars['String']['output']>;
  mealTitle: Scalars['String']['output'];
  mealType?: Maybe<MealType>;
  title: Scalars['String']['output'];
};

export type Cook = {
  __typename?: 'Cook';
  biography: Scalars['String']['output'];
  bookingRequests: Array<BookingRequest>;
  cookId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  followerCount: Scalars['UnsignedInt']['output'];
  followers: Array<Following>;
  hasStripePayoutMethodActivated: Scalars['Boolean']['output'];
  isLocked: Scalars['Boolean']['output'];
  isVisible: Scalars['Boolean']['output'];
  languages: Array<Language>;
  location: Location;
  maximumParticipants?: Maybe<Scalars['UnsignedInt']['output']>;
  maximumPrice?: Maybe<Scalars['UnsignedInt']['output']>;
  maximumTravelDistance?: Maybe<Scalars['UnsignedInt']['output']>;
  mealCount: Scalars['UnsignedInt']['output'];
  meals: Array<Meal>;
  menuCount: Scalars['UnsignedInt']['output'];
  menus: Array<Menu>;
  minimumParticipants?: Maybe<Scalars['UnsignedInt']['output']>;
  minimumPrice?: Maybe<Scalars['UnsignedInt']['output']>;
  rank: CookRank;
  ratingAverage: Scalars['UnsignedInt']['output'];
  ratingCount: Scalars['UnsignedInt']['output'];
  travelExpenses: Scalars['UnsignedInt']['output'];
  user: User;
};

export type CookBookingRequestChatMessageMutation = {
  __typename?: 'CookBookingRequestChatMessageMutation';
  bookingRequestId: Scalars['String']['output'];
  cookId: Scalars['String']['output'];
  createOne: Scalars['Boolean']['output'];
};


export type CookBookingRequestChatMessageMutationCreateOneArgs = {
  request: CreateChatMessageRequest;
};

export type CookBookingRequestChatMessageQuery = {
  __typename?: 'CookBookingRequestChatMessageQuery';
  bookingRequestId: Scalars['String']['output'];
  cookId: Scalars['String']['output'];
  findMany?: Maybe<Array<ChatMessage>>;
};


export type CookBookingRequestChatMessageQueryFindManyArgs = {
  request?: InputMaybe<FindManyRequest>;
};

export type CookBookingRequestMutation = {
  __typename?: 'CookBookingRequestMutation';
  accept: Scalars['Boolean']['output'];
  chatMessages: CookBookingRequestChatMessageMutation;
  cookId: Scalars['String']['output'];
  createOne: Scalars['Boolean']['output'];
  decline: Scalars['Boolean']['output'];
  updatePrice: Scalars['Boolean']['output'];
};


export type CookBookingRequestMutationAcceptArgs = {
  bookingRequestId: Scalars['String']['input'];
};


export type CookBookingRequestMutationChatMessagesArgs = {
  bookingRequestId: Scalars['String']['input'];
};


export type CookBookingRequestMutationCreateOneArgs = {
  globalBookingRequestId: Scalars['String']['input'];
};


export type CookBookingRequestMutationDeclineArgs = {
  bookingRequestId: Scalars['String']['input'];
};


export type CookBookingRequestMutationUpdatePriceArgs = {
  bookingRequestId: Scalars['String']['input'];
  price: PriceInput;
};

export type CookBookingRequestQuery = {
  __typename?: 'CookBookingRequestQuery';
  chatMessages: CookBookingRequestChatMessageQuery;
  cookId: Scalars['String']['output'];
  findMany?: Maybe<Array<BookingRequest>>;
  findOne?: Maybe<BookingRequest>;
};


export type CookBookingRequestQueryChatMessagesArgs = {
  bookingRequestId: Scalars['String']['input'];
};


export type CookBookingRequestQueryFindManyArgs = {
  request?: InputMaybe<FindManyRequest>;
};


export type CookBookingRequestQueryFindOneArgs = {
  bookingRequestId: Scalars['String']['input'];
};

export type CookCookRatingQuery = {
  __typename?: 'CookCookRatingQuery';
  cookId: Scalars['String']['output'];
  findMany: Array<CookRating>;
};

export type CookCookVisitQuery = {
  __typename?: 'CookCookVisitQuery';
  cookId: Scalars['String']['output'];
  findMany?: Maybe<Array<Address>>;
};


export type CookCookVisitQueryFindManyArgs = {
  request?: InputMaybe<FindManyRequest>;
};

export type CookFollowingQuery = {
  __typename?: 'CookFollowingQuery';
  findAll: Array<Following>;
};

export type CookGlobalBookingRequestQuery = {
  __typename?: 'CookGlobalBookingRequestQuery';
  cookId: Scalars['String']['output'];
  findMany?: Maybe<Array<GlobalBookingRequest>>;
  findOne?: Maybe<GlobalBookingRequest>;
};


export type CookGlobalBookingRequestQueryFindManyArgs = {
  request?: InputMaybe<FindManyRequest>;
};


export type CookGlobalBookingRequestQueryFindOneArgs = {
  globalBookingRequestId: Scalars['String']['input'];
};

export type CookMealMutation = {
  __typename?: 'CookMealMutation';
  cookId: Scalars['String']['output'];
  createOne: Scalars['Boolean']['output'];
  deleteOne: Scalars['Boolean']['output'];
  updateDescription: Scalars['Boolean']['output'];
  updateImage: Scalars['Boolean']['output'];
  updateTitle: Scalars['Boolean']['output'];
  updateType: Scalars['Boolean']['output'];
};


export type CookMealMutationCreateOneArgs = {
  image?: InputMaybe<Scalars['Upload']['input']>;
  meal: CreateOneMealRequest;
};


export type CookMealMutationDeleteOneArgs = {
  mealId: Scalars['String']['input'];
};


export type CookMealMutationUpdateDescriptionArgs = {
  description: Scalars['String']['input'];
  mealId: Scalars['String']['input'];
};


export type CookMealMutationUpdateImageArgs = {
  image?: InputMaybe<Scalars['Upload']['input']>;
  mealId: Scalars['String']['input'];
};


export type CookMealMutationUpdateTitleArgs = {
  mealId: Scalars['String']['input'];
  title: Scalars['String']['input'];
};


export type CookMealMutationUpdateTypeArgs = {
  mealId: Scalars['String']['input'];
  type: MealType;
};

export type CookMealQuery = {
  __typename?: 'CookMealQuery';
  cookId: Scalars['String']['output'];
  findMany: Array<Meal>;
  findOne?: Maybe<Meal>;
};


export type CookMealQueryFindManyArgs = {
  request?: InputMaybe<FindManyRequest>;
};


export type CookMealQueryFindOneArgs = {
  mealId: Scalars['String']['input'];
};

export type CookMenuCourseMealOptionMutation = {
  __typename?: 'CookMenuCourseMealOptionMutation';
  cookId: Scalars['String']['output'];
  courseId: Scalars['String']['output'];
  createMany: Scalars['Boolean']['output'];
  createOne: Scalars['Boolean']['output'];
  deleteOne: Scalars['Boolean']['output'];
  menuId: Scalars['String']['output'];
};


export type CookMenuCourseMealOptionMutationCreateManyArgs = {
  mealOptions: Array<CreateOneMealOptionRequest>;
};


export type CookMenuCourseMealOptionMutationCreateOneArgs = {
  mealOption: CreateOneMealOptionRequest;
};


export type CookMenuCourseMealOptionMutationDeleteOneArgs = {
  mealId: Scalars['String']['input'];
};

export type CookMenuCourseMealOptionQuery = {
  __typename?: 'CookMenuCourseMealOptionQuery';
  cookId: Scalars['String']['output'];
  findMany: Array<MealOption>;
  menuId: Scalars['String']['output'];
};


export type CookMenuCourseMealOptionQueryFindManyArgs = {
  request?: InputMaybe<FindManyRequest>;
};

export type CookMenuCourseMutation = {
  __typename?: 'CookMenuCourseMutation';
  cookId: Scalars['String']['output'];
  createOne: Scalars['Boolean']['output'];
  deleteOne: Scalars['Boolean']['output'];
  mealOptions: CookMenuCourseMealOptionMutation;
  menuId: Scalars['String']['output'];
  updateTitle: Scalars['Boolean']['output'];
};


export type CookMenuCourseMutationCreateOneArgs = {
  request: CreateOneCourseRequest;
};


export type CookMenuCourseMutationDeleteOneArgs = {
  courseId: Scalars['String']['input'];
};


export type CookMenuCourseMutationMealOptionsArgs = {
  courseId: Scalars['String']['input'];
};


export type CookMenuCourseMutationUpdateTitleArgs = {
  courseId: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CookMenuCourseQuery = {
  __typename?: 'CookMenuCourseQuery';
  cookId: Scalars['String']['output'];
  findAll: Array<Course>;
  mealOptions: CookMenuCourseMealOptionQuery;
  menuId: Scalars['String']['output'];
};


export type CookMenuCourseQueryMealOptionsArgs = {
  courseId: Scalars['String']['input'];
};

export type CookMenuMutation = {
  __typename?: 'CookMenuMutation';
  cookId: Scalars['String']['output'];
  courses: CookMenuCourseMutation;
  createOne: Scalars['Boolean']['output'];
  deleteOne: Scalars['Boolean']['output'];
  updateBasePrice: Scalars['Boolean']['output'];
  updateBasePriceCustomers: Scalars['Boolean']['output'];
  updateCurrencyCode: Scalars['Boolean']['output'];
  updateDescription: Scalars['Boolean']['output'];
  updateGreetingFromKitchen: Scalars['Boolean']['output'];
  updateIsVisible: Scalars['Boolean']['output'];
  updateKitchenId: Scalars['Boolean']['output'];
  updatePreparationTime: Scalars['Boolean']['output'];
  updatePricePerAdult: Scalars['Boolean']['output'];
  updatePricePerChild: Scalars['Boolean']['output'];
  updateTitle: Scalars['Boolean']['output'];
};


export type CookMenuMutationCoursesArgs = {
  menuId: Scalars['String']['input'];
};


export type CookMenuMutationCreateOneArgs = {
  menu: CreateOneMenuRequest;
};


export type CookMenuMutationDeleteOneArgs = {
  menuId: Scalars['String']['input'];
};


export type CookMenuMutationUpdateBasePriceArgs = {
  basePrice: Scalars['UnsignedInt']['input'];
  menuId: Scalars['String']['input'];
};


export type CookMenuMutationUpdateBasePriceCustomersArgs = {
  basePriceCustomers: Scalars['UnsignedInt']['input'];
  menuId: Scalars['String']['input'];
};


export type CookMenuMutationUpdateCurrencyCodeArgs = {
  currencyCode: CurrencyCode;
  menuId: Scalars['String']['input'];
};


export type CookMenuMutationUpdateDescriptionArgs = {
  description: Scalars['String']['input'];
  menuId: Scalars['String']['input'];
};


export type CookMenuMutationUpdateGreetingFromKitchenArgs = {
  greetingFromKitchen?: InputMaybe<Scalars['String']['input']>;
  menuId: Scalars['String']['input'];
};


export type CookMenuMutationUpdateIsVisibleArgs = {
  isVisible: Scalars['Boolean']['input'];
  menuId: Scalars['String']['input'];
};


export type CookMenuMutationUpdateKitchenIdArgs = {
  kitchenId?: InputMaybe<Scalars['String']['input']>;
  menuId: Scalars['String']['input'];
};


export type CookMenuMutationUpdatePreparationTimeArgs = {
  menuId: Scalars['String']['input'];
  preparationTime: Scalars['UnsignedInt']['input'];
};


export type CookMenuMutationUpdatePricePerAdultArgs = {
  menuId: Scalars['String']['input'];
  pricePerAdult: Scalars['UnsignedInt']['input'];
};


export type CookMenuMutationUpdatePricePerChildArgs = {
  menuId: Scalars['String']['input'];
  pricePerChild?: InputMaybe<Scalars['UnsignedInt']['input']>;
};


export type CookMenuMutationUpdateTitleArgs = {
  menuId: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CookMenuQuery = {
  __typename?: 'CookMenuQuery';
  cookId: Scalars['String']['output'];
  courses: CookMenuCourseQuery;
  findMany: Array<Menu>;
  findOne?: Maybe<Menu>;
};


export type CookMenuQueryCoursesArgs = {
  cookId: Scalars['String']['input'];
  menuId: Scalars['String']['input'];
};


export type CookMenuQueryFindManyArgs = {
  request?: InputMaybe<FindManyRequest>;
};


export type CookMenuQueryFindOneArgs = {
  menuId: Scalars['String']['input'];
};

export type CookMenuVisitQuery = {
  __typename?: 'CookMenuVisitQuery';
  cookId: Scalars['String']['output'];
  findMany?: Maybe<Array<Address>>;
};


export type CookMenuVisitQueryFindManyArgs = {
  request?: InputMaybe<FindManyRequest>;
};

export type CookMutation = {
  __typename?: 'CookMutation';
  addOneLanguage: Scalars['Boolean']['output'];
  bookingRequests: CookBookingRequestMutation;
  createOne: Scalars['Boolean']['output'];
  meals: CookMealMutation;
  menus: CookMenuMutation;
  removeOneLanguage: Scalars['Boolean']['output'];
  updateBiography: Scalars['Boolean']['output'];
  updateHasStripePayoutMethodActivated: Scalars['Boolean']['output'];
  updateIsLocked: Scalars['Boolean']['output'];
  updateIsVisible: Scalars['Boolean']['output'];
  updateLocation: Scalars['Boolean']['output'];
  updateMaximumParticipants: Scalars['Boolean']['output'];
  updateMaximumPrice: Scalars['Boolean']['output'];
  updateMaximumTravelDistance: Scalars['Boolean']['output'];
  updateMinimumParticipants: Scalars['Boolean']['output'];
  updateMinimumPrice: Scalars['Boolean']['output'];
  updateRank: Scalars['Boolean']['output'];
  updateTravelExpenses: Scalars['Boolean']['output'];
};


export type CookMutationAddOneLanguageArgs = {
  cookId: Scalars['String']['input'];
  languageId: Scalars['String']['input'];
};


export type CookMutationBookingRequestsArgs = {
  cookId: Scalars['String']['input'];
};


export type CookMutationCreateOneArgs = {
  cookId: Scalars['String']['input'];
  request: CreateOneCookRequest;
};


export type CookMutationMealsArgs = {
  cookId: Scalars['String']['input'];
};


export type CookMutationMenusArgs = {
  cookId: Scalars['String']['input'];
};


export type CookMutationRemoveOneLanguageArgs = {
  cookId: Scalars['String']['input'];
  languageId: Scalars['String']['input'];
};


export type CookMutationUpdateBiographyArgs = {
  biography: Scalars['String']['input'];
  cookId: Scalars['String']['input'];
};


export type CookMutationUpdateHasStripePayoutMethodActivatedArgs = {
  cookId: Scalars['String']['input'];
};


export type CookMutationUpdateIsLockedArgs = {
  cookId: Scalars['String']['input'];
  isLocked: Scalars['Boolean']['input'];
};


export type CookMutationUpdateIsVisibleArgs = {
  cookId: Scalars['String']['input'];
  isVisible: Scalars['Boolean']['input'];
};


export type CookMutationUpdateLocationArgs = {
  cookId: Scalars['String']['input'];
  location: LocationInput;
};


export type CookMutationUpdateMaximumParticipantsArgs = {
  cookId: Scalars['String']['input'];
  maximumParticipants?: InputMaybe<Scalars['UnsignedInt']['input']>;
};


export type CookMutationUpdateMaximumPriceArgs = {
  cookId: Scalars['String']['input'];
  maximumPrice?: InputMaybe<Scalars['UnsignedInt']['input']>;
};


export type CookMutationUpdateMaximumTravelDistanceArgs = {
  cookId: Scalars['String']['input'];
  maximumTravelDistance?: InputMaybe<Scalars['UnsignedInt']['input']>;
};


export type CookMutationUpdateMinimumParticipantsArgs = {
  cookId: Scalars['String']['input'];
  minimumParticipants?: InputMaybe<Scalars['UnsignedInt']['input']>;
};


export type CookMutationUpdateMinimumPriceArgs = {
  cookId: Scalars['String']['input'];
  minimumPrice?: InputMaybe<Scalars['UnsignedInt']['input']>;
};


export type CookMutationUpdateRankArgs = {
  cookId: Scalars['String']['input'];
  rank: CookRank;
};


export type CookMutationUpdateTravelExpensesArgs = {
  cookId: Scalars['String']['input'];
  travelExpenses: Scalars['UnsignedInt']['input'];
};

export type CookQuery = {
  __typename?: 'CookQuery';
  bookingRequests: CookBookingRequestQuery;
  cookRatings: CookCookRatingQuery;
  cookVisits: UserAddressQuery;
  findMany: Array<Cook>;
  findOne?: Maybe<Cook>;
  followers: CookFollowingQuery;
  getStripeDashboardUrl?: Maybe<Scalars['URL']['output']>;
  getStripeOnboardingUrl?: Maybe<Scalars['URL']['output']>;
  globalBookingRequests: CookGlobalBookingRequestQuery;
  meals: CookMealQuery;
  menuVisits: UserAddressQuery;
  menus: CookMenuQuery;
  userRatings: CookUserRatingQuery;
};


export type CookQueryBookingRequestsArgs = {
  cookId: Scalars['String']['input'];
};


export type CookQueryCookRatingsArgs = {
  cookId: Scalars['String']['input'];
};


export type CookQueryCookVisitsArgs = {
  cookId: Scalars['String']['input'];
};


export type CookQueryFindManyArgs = {
  request: FindManyRequest;
};


export type CookQueryFindOneArgs = {
  cookId: Scalars['String']['input'];
};


export type CookQueryGetStripeDashboardUrlArgs = {
  cookId: Scalars['String']['input'];
};


export type CookQueryGetStripeOnboardingUrlArgs = {
  cookId: Scalars['String']['input'];
};


export type CookQueryGlobalBookingRequestsArgs = {
  cookId: Scalars['String']['input'];
};


export type CookQueryMealsArgs = {
  cookId: Scalars['String']['input'];
};


export type CookQueryMenuVisitsArgs = {
  cookId: Scalars['String']['input'];
};


export type CookQueryMenusArgs = {
  cookId: Scalars['String']['input'];
};


export type CookQueryUserRatingsArgs = {
  cookId: Scalars['String']['input'];
};

export type CookRank =
  | 'HOBBY'
  | 'PROFESSIONAL';

export type CookRating = {
  __typename?: 'CookRating';
  bookingRequest: BookingRequest;
  bookingRequestId: Scalars['String']['output'];
  comment?: Maybe<Scalars['String']['output']>;
  cook: PublicCook;
  cookId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  user: PublicUser;
  userId: Scalars['String']['output'];
  value: Scalars['UnsignedInt']['output'];
};

export type CookSpecificFee = {
  __typename?: 'CookSpecificFee';
  cookId: Scalars['String']['output'];
};

export type CookSpecificFeeMutation = {
  __typename?: 'CookSpecificFeeMutation';
  createOne: Scalars['Boolean']['output'];
};

export type CookSpecificFeeQuery = {
  __typename?: 'CookSpecificFeeQuery';
  findMany: Array<CookSpecificFee>;
  findOne?: Maybe<CookSpecificFee>;
};


export type CookSpecificFeeQueryFindManyArgs = {
  request?: InputMaybe<FindManyRequest>;
};


export type CookSpecificFeeQueryFindOneArgs = {
  cookId: Scalars['String']['input'];
};

export type CookUserRatingQuery = {
  __typename?: 'CookUserRatingQuery';
  cookId: Scalars['String']['output'];
  findMany: Array<UserRating>;
};

export type CookVisit = {
  __typename?: 'CookVisit';
  cook: PublicCook;
  cookId: Scalars['String']['output'];
  cookVisitId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  session: AnonymousSession;
  sessionId: Scalars['String']['output'];
};

export type Course = {
  __typename?: 'Course';
  cookId: Scalars['String']['output'];
  courseId: Scalars['String']['output'];
  index: Scalars['UnsignedInt']['output'];
  mealOptionCount: Scalars['UnsignedInt']['output'];
  mealOptions: Array<MealOption>;
  menuId: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type CreateBookingRequestRequest = {
  cook?: InputMaybe<CreateCookBookingRequestRequest>;
  menu?: InputMaybe<CreateMenuBookingRequestRequest>;
};

export type CreateChatMessageRequest = {
  message: Scalars['String']['input'];
};

export type CreateConfiguredMenuCourseRequest = {
  courseId: Scalars['String']['input'];
  mealId: Scalars['String']['input'];
};

export type CreateConfiguredMenuRequest = {
  courses: Array<CreateConfiguredMenuCourseRequest>;
  menuId: Scalars['String']['input'];
};

export type CreateCookBookingRequestRequest = {
  adultParticipants: Scalars['UnsignedInt']['input'];
  children: Scalars['UnsignedInt']['input'];
  cookId: Scalars['String']['input'];
  dateTime: Scalars['DateTime']['input'];
  duration: Scalars['UnsignedInt']['input'];
  kitchenId?: InputMaybe<Scalars['String']['input']>;
  location: LocationInput;
  message: Scalars['String']['input'];
  occasion: Scalars['String']['input'];
  preparationTime: Scalars['UnsignedInt']['input'];
  price: PriceInput;
  travelExpensesAmount: Scalars['UnsignedInt']['input'];
};

export type CreateMenuBookingRequestRequest = {
  adultParticipants: Scalars['UnsignedInt']['input'];
  children: Scalars['UnsignedInt']['input'];
  configuredMenu: CreateConfiguredMenuRequest;
  cookId: Scalars['String']['input'];
  dateTime: Scalars['DateTime']['input'];
  duration: Scalars['UnsignedInt']['input'];
  location: LocationInput;
  message: Scalars['String']['input'];
  occasion: Scalars['String']['input'];
  preparationTime: Scalars['UnsignedInt']['input'];
  travelExpensesAmount: Scalars['UnsignedInt']['input'];
};

export type CreateOneAddressRequest = {
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  houseNumber: Scalars['String']['input'];
  location: LocationInput;
  postCode: Scalars['String']['input'];
  street: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateOneAdminRequest = {
  adminId: Scalars['String']['input'];
};

export type CreateOneCookRequest = {
  biography: Scalars['String']['input'];
  isVisible: Scalars['Boolean']['input'];
  languageIds?: InputMaybe<Array<Scalars['String']['input']>>;
  location: LocationInput;
  maximumParticipants?: InputMaybe<Scalars['UnsignedInt']['input']>;
  maximumPrice?: InputMaybe<Scalars['UnsignedInt']['input']>;
  maximumTravelDistance?: InputMaybe<Scalars['UnsignedInt']['input']>;
  minimumParticipants?: InputMaybe<Scalars['UnsignedInt']['input']>;
  minimumPrice?: InputMaybe<Scalars['UnsignedInt']['input']>;
  rank: CookRank;
  travelExpenses: Scalars['UnsignedInt']['input'];
};

export type CreateOneCourseRequest = {
  index: Scalars['UnsignedInt']['input'];
  mealOptions?: InputMaybe<Array<CreateOneMealOptionRequest>>;
  title: Scalars['String']['input'];
};

export type CreateOneGlobalBookingRequestRequest = {
  adultParticipants: Scalars['UnsignedInt']['input'];
  allergyIds?: InputMaybe<Array<Scalars['String']['input']>>;
  categoryIds?: InputMaybe<Array<Scalars['String']['input']>>;
  children: Scalars['UnsignedInt']['input'];
  dateTime: Scalars['DateTime']['input'];
  duration: Scalars['UnsignedInt']['input'];
  kitchenId?: InputMaybe<Scalars['String']['input']>;
  location: LocationInput;
  message: Scalars['String']['input'];
  occasion: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['PhoneNumber']['input']>;
  priceClassType: GlobalBookingRequestPriceClassType;
};

export type CreateOneMealOptionRequest = {
  index: Scalars['UnsignedInt']['input'];
  mealId: Scalars['String']['input'];
};

export type CreateOneMealRequest = {
  description: Scalars['String']['input'];
  title: Scalars['String']['input'];
  type: MealType;
};

export type CreateOneMenuRequest = {
  basePrice: Scalars['UnsignedInt']['input'];
  basePriceCustomers: Scalars['UnsignedInt']['input'];
  categoryIds?: InputMaybe<Array<Scalars['String']['input']>>;
  courses?: InputMaybe<Array<CreateOneCourseRequest>>;
  currencyCode: CurrencyCode;
  description: Scalars['String']['input'];
  greetingFromKitchen?: InputMaybe<Scalars['String']['input']>;
  isVisible: Scalars['Boolean']['input'];
  kitchenId?: InputMaybe<Scalars['String']['input']>;
  preparationTime: Scalars['UnsignedInt']['input'];
  pricePerAdult: Scalars['UnsignedInt']['input'];
  pricePerChild?: InputMaybe<Scalars['UnsignedInt']['input']>;
  title: Scalars['String']['input'];
};

export type CreateOneNotificationRequest = {
  message: Scalars['String']['input'];
  url?: InputMaybe<Scalars['URL']['input']>;
};

export type CreateOnePrivacyPolicyUpdateRequest = {
  englishText: Scalars['String']['input'];
  germanText: Scalars['String']['input'];
};

export type CreateOneSearchRequestRequest = {
  adults: Scalars['UnsignedInt']['input'];
  children: Scalars['UnsignedInt']['input'];
  date: Scalars['Date']['input'];
  locationText: Scalars['String']['input'];
  origin: SearchRequestOrigin;
};

export type CreateOneSessionByEmailAddressRequest = {
  emailAddress: Scalars['EmailAddress']['input'];
  password: Scalars['String']['input'];
  platform: Platform;
  pushToken?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateOneSessionByIdentityProviderRequest = {
  idToken: Scalars['String']['input'];
  identityProvider: IdentityProvider;
  platform: Platform;
  title: Scalars['String']['input'];
};

export type CreateOneSessionByPhoneNumberRequest = {
  password: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  platform: Platform;
  pushToken?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateOneSupportRequest = {
  bookingRequestId?: InputMaybe<Scalars['String']['input']>;
  message: Scalars['String']['input'];
  subject: Scalars['String']['input'];
};

export type CreateOneTermsUpdateRequest = {
  englishText: Scalars['String']['input'];
  germanText: Scalars['String']['input'];
};

export type CreateOneUserByEmailAddressRequest = {
  addresses?: InputMaybe<Array<CreateOneAddressRequest>>;
  birthDate?: InputMaybe<Scalars['Date']['input']>;
  cook?: InputMaybe<CreateOneCookRequest>;
  emailAddress?: InputMaybe<Scalars['EmailAddress']['input']>;
  firstName: Scalars['String']['input'];
  gender: Gender;
  globalBookingRequest?: InputMaybe<CreateOneGlobalBookingRequestRequest>;
  language: UserLanguage;
  lastName: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['PhoneNumber']['input']>;
  profilePictureUrl?: InputMaybe<Scalars['URL']['input']>;
};

export type CreateOneUserByIdentityProviderRequest = {
  birthDate?: InputMaybe<Scalars['Date']['input']>;
  cook?: InputMaybe<CreateOneCookRequest>;
  firstName: Scalars['String']['input'];
  gender: Gender;
  globalBookingRequest?: InputMaybe<CreateOneGlobalBookingRequestRequest>;
  idToken: Scalars['String']['input'];
  identityProvider: IdentityProvider;
  language: UserLanguage;
  lastName: Scalars['String']['input'];
  profilePictureUrl?: InputMaybe<Scalars['URL']['input']>;
};

export type CreateOneUserByPhoneNumberRequest = {
  birthDate?: InputMaybe<Scalars['Date']['input']>;
  cook?: InputMaybe<CreateOneCookRequest>;
  firstName: Scalars['String']['input'];
  gender: Gender;
  globalBookingRequest?: InputMaybe<CreateOneGlobalBookingRequestRequest>;
  language: UserLanguage;
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phoneNumber: Scalars['PhoneNumber']['input'];
  profilePictureUrl?: InputMaybe<Scalars['URL']['input']>;
};

export type CurrencyCode =
  | 'EUR'
  | 'USD';

export type CustomerFeeUpdate = {
  __typename?: 'CustomerFeeUpdate';
  adminId: Scalars['String']['output'];
  user: PublicUser;
};

export type CustomerFeeUpdateMutation = {
  __typename?: 'CustomerFeeUpdateMutation';
  createOne: Scalars['Boolean']['output'];
};

export type CustomerFeeUpdateQuery = {
  __typename?: 'CustomerFeeUpdateQuery';
  findMany: Array<Admin>;
  findOne?: Maybe<Admin>;
};


export type CustomerFeeUpdateQueryFindManyArgs = {
  request?: InputMaybe<FindManyRequest>;
};


export type CustomerFeeUpdateQueryFindOneArgs = {
  adminId: Scalars['String']['input'];
};

export type EmailAddressUpdate = {
  __typename?: 'EmailAddressUpdate';
  createdAt: Scalars['DateTime']['output'];
  emailAddress: Scalars['EmailAddress']['output'];
  userId: Scalars['String']['output'];
};

export type ExpireOneSessionRequest = {
  sessionId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type FindManyPublicCooksRequest = {
  adultParticipants: Scalars['UnsignedInt']['input'];
  categoryIds?: InputMaybe<Array<Scalars['String']['input']>>;
  children?: InputMaybe<Scalars['UnsignedInt']['input']>;
  dateTime: Scalars['DateTime']['input'];
  kitchenIds?: InputMaybe<Array<Scalars['String']['input']>>;
  location?: InputMaybe<LocationInput>;
  price?: InputMaybe<PriceInput>;
  searchText?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['UnsignedInt']['input']>;
  take?: InputMaybe<Scalars['UnsignedInt']['input']>;
};

export type FindManyPublicMenusRequest = {
  adultParticipants: Scalars['UnsignedInt']['input'];
  categoryIds?: InputMaybe<Array<Scalars['String']['input']>>;
  children?: InputMaybe<Scalars['UnsignedInt']['input']>;
  dateTime: Scalars['DateTime']['input'];
  kitchenIds?: InputMaybe<Array<Scalars['String']['input']>>;
  location?: InputMaybe<LocationInput>;
  price?: InputMaybe<PriceInput>;
  searchText?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['UnsignedInt']['input']>;
  take?: InputMaybe<Scalars['UnsignedInt']['input']>;
};

export type FindManyRequest = {
  searchText?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['UnsignedInt']['input']>;
  take?: InputMaybe<Scalars['UnsignedInt']['input']>;
};

export type Following = {
  __typename?: 'Following';
  cook: PublicCook;
  cookId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  user: AnonymousUser;
  userId: Scalars['String']['output'];
};

export type Gender =
  | 'DIVERSE'
  | 'FEMALE'
  | 'MALE'
  | 'NO_INFORMATION';

export type GlobalBookingRequest = {
  __typename?: 'GlobalBookingRequest';
  adultParticipants: Scalars['UnsignedInt']['output'];
  allergies: Array<Allergy>;
  children: Scalars['UnsignedInt']['output'];
  createdAt: Scalars['DateTime']['output'];
  dateTime: Scalars['DateTime']['output'];
  duration?: Maybe<Scalars['UnsignedInt']['output']>;
  globalBookingRequestId: Scalars['String']['output'];
  location: Location;
  message: Scalars['String']['output'];
  occasion: Scalars['String']['output'];
  priceClass: GlobalBookingRequestPriceClass;
  priceClassType: GlobalBookingRequestPriceClassType;
  user: PublicUser;
  userId: Scalars['String']['output'];
};

export type GlobalBookingRequestPriceClass = {
  __typename?: 'GlobalBookingRequestPriceClass';
  currencyCode: CurrencyCode;
  max: Scalars['UnsignedInt']['output'];
  min: Scalars['UnsignedInt']['output'];
  type: GlobalBookingRequestPriceClassType;
};

export type GlobalBookingRequestPriceClassType =
  | 'FINE'
  | 'GOURMET'
  | 'SIMPLE';

export type GlobalBookingRequestQuery = {
  __typename?: 'GlobalBookingRequestQuery';
  findMany?: Maybe<Array<GlobalBookingRequest>>;
  findOne?: Maybe<GlobalBookingRequest>;
};


export type GlobalBookingRequestQueryFindOneArgs = {
  globalBookingRequestId: Scalars['String']['input'];
};

export type IdentityProvider =
  | 'APPLE'
  | 'GOOGLE';

export type Kitchen = {
  __typename?: 'Kitchen';
  kitchenId: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type KitchenMutation = {
  __typename?: 'KitchenMutation';
  createOne: Scalars['Boolean']['output'];
};

export type KitchenQuery = {
  __typename?: 'KitchenQuery';
  findAll: Array<Kitchen>;
};

export type Language = {
  __typename?: 'Language';
  languageId: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type LanguageMutation = {
  __typename?: 'LanguageMutation';
  createOne: Scalars['Boolean']['output'];
};

export type LanguageQuery = {
  __typename?: 'LanguageQuery';
  findAll: Array<Language>;
};

export type Location = {
  __typename?: 'Location';
  latitude: Scalars['Latitude']['output'];
  longitude: Scalars['Longitude']['output'];
  text: Scalars['String']['output'];
};

export type LocationInput = {
  latitude: Scalars['Latitude']['input'];
  longitude: Scalars['Longitude']['input'];
  text?: InputMaybe<Scalars['String']['input']>;
};

export type Meal = {
  __typename?: 'Meal';
  cookId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  imageUrl?: Maybe<Scalars['URL']['output']>;
  mealId: Scalars['String']['output'];
  title: Scalars['String']['output'];
  type: MealType;
};

export type MealOption = {
  __typename?: 'MealOption';
  index: Scalars['UnsignedInt']['output'];
  meal: Meal;
  mealId: Scalars['String']['output'];
};

export type MealType =
  | 'DESSERT'
  | 'FISH'
  | 'MEAT'
  | 'SOUP'
  | 'SPECIAL'
  | 'VEGAN'
  | 'VEGETARIAN';

export type Menu = {
  __typename?: 'Menu';
  basePrice: Scalars['UnsignedInt']['output'];
  basePriceCustomers: Scalars['UnsignedInt']['output'];
  categories: Array<Category>;
  cook: Cook;
  cookId: Scalars['String']['output'];
  courseCount: Scalars['UnsignedInt']['output'];
  courses: Array<Course>;
  createdAt: Scalars['DateTime']['output'];
  currencyCode: CurrencyCode;
  description: Scalars['String']['output'];
  greetingFromKitchen?: Maybe<Scalars['String']['output']>;
  imageUrls: Array<Scalars['URL']['output']>;
  isVisible: Scalars['Boolean']['output'];
  kitchen?: Maybe<Kitchen>;
  kitchenId?: Maybe<Scalars['String']['output']>;
  menuId: Scalars['String']['output'];
  preparationTime: Scalars['UnsignedInt']['output'];
  pricePerAdult: Scalars['UnsignedInt']['output'];
  pricePerChild?: Maybe<Scalars['UnsignedInt']['output']>;
  title: Scalars['String']['output'];
};

export type MenuConfiguration = {
  __typename?: 'MenuConfiguration';
  bookingRequestId: Scalars['String']['output'];
  categories: Array<Category>;
  categoryIds: Array<Scalars['String']['output']>;
  courses: Array<MenuConfigurationCourse>;
  greetingsFromKitchen: Scalars['Boolean']['output'];
  kitchen: Kitchen;
  kitchenId: Scalars['String']['output'];
  menuDescription: Scalars['String']['output'];
  menuId: Scalars['String']['output'];
  menuTitle: Scalars['String']['output'];
};

export type MenuConfigurationCourse = {
  __typename?: 'MenuConfigurationCourse';
  courseTitle: Scalars['String']['output'];
  mealDescription: Scalars['String']['output'];
  mealImageUrl: Scalars['URL']['output'];
  mealTitle: Scalars['String']['output'];
  mealType: MealType;
};

export type MenuVisit = {
  __typename?: 'MenuVisit';
  createdAt: Scalars['DateTime']['output'];
  menu: PublicMenu;
  menuId: Scalars['String']['output'];
  menuVisitId: Scalars['String']['output'];
  session: AnonymousSession;
  sessionId: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  admins: AdminMutation;
  allergies: AllergyMutation;
  categories: CategoryMutation;
  cookSpecificFees: CookSpecificFeeMutation;
  cooks: CookMutation;
  customerFeeUpdates: CustomerFeeUpdateMutation;
  kitchens: KitchenMutation;
  languages: LanguageMutation;
  notifications: NotificationMutation;
  privacyPolicyUpdates: PrivacyPolicyUpdateMutation;
  searchRequests: SearchRequestMutation;
  sessions: SessionMutation;
  termsUpdates: TermsUpdateMutation;
  users: UserMutation;
};

export type Notification = {
  __typename?: 'Notification';
  createdAt: Scalars['DateTime']['output'];
  message: Scalars['String']['output'];
  notificationId: Scalars['String']['output'];
  url?: Maybe<Scalars['URL']['output']>;
  userId: Scalars['String']['output'];
  wasRead?: Maybe<Scalars['Boolean']['output']>;
};

export type NotificationConfiguration = {
  __typename?: 'NotificationConfiguration';
  emailsForAccount: Scalars['Boolean']['output'];
  emailsForBookingRequests: Scalars['Boolean']['output'];
  emailsForFavoriteCooks: Scalars['Boolean']['output'];
  emailsForOffers: Scalars['Boolean']['output'];
  pushesForAccount: Scalars['Boolean']['output'];
  pushesForBookingRequests: Scalars['Boolean']['output'];
  pushesForFavoriteCooks: Scalars['Boolean']['output'];
  pushesForOffers: Scalars['Boolean']['output'];
  userId: Scalars['String']['output'];
};

export type NotificationConfigurationMutation = {
  __typename?: 'NotificationConfigurationMutation';
  update: Scalars['Boolean']['output'];
  userId: Scalars['String']['output'];
};

export type NotificationConfigurationQuery = {
  __typename?: 'NotificationConfigurationQuery';
  findOne: NotificationConfiguration;
  userId: Scalars['String']['output'];
};

export type NotificationMutation = {
  __typename?: 'NotificationMutation';
  createOne: Scalars['Boolean']['output'];
};


export type NotificationMutationCreateOneArgs = {
  request: CreateOneNotificationRequest;
};

export type NotificationQuery = {
  __typename?: 'NotificationQuery';
  findMany?: Maybe<Array<Notification>>;
  userId: Scalars['String']['output'];
};

export type OneTimeAccessToken = {
  __typename?: 'OneTimeAccessToken';
  createdAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

export type PaymentProvider =
  | 'STRIPE';

export type PhoneNumberUpdate = {
  __typename?: 'PhoneNumberUpdate';
  createdAt: Scalars['DateTime']['output'];
  phoneNumber: Scalars['PhoneNumber']['output'];
  userId: Scalars['String']['output'];
};

export type Platform =
  | 'ANDROID'
  | 'BROWSER'
  | 'IOS'
  | 'NO_INFORMATION';

export type Price = {
  __typename?: 'Price';
  amount: Scalars['UnsignedInt']['output'];
  currencyCode: CurrencyCode;
};

export type PriceInput = {
  amount: Scalars['UnsignedInt']['input'];
  currencyCode: CurrencyCode;
};

export type PrivacyPolicyUpdate = {
  __typename?: 'PrivacyPolicyUpdate';
  admin: Admin;
  adminId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  englishText: Scalars['String']['output'];
  germanText: Scalars['String']['output'];
  privacyPolicyUpdateId: Scalars['String']['output'];
};

export type PrivacyPolicyUpdateMutation = {
  __typename?: 'PrivacyPolicyUpdateMutation';
  createOne: Scalars['Boolean']['output'];
};


export type PrivacyPolicyUpdateMutationCreateOneArgs = {
  request: CreateOnePrivacyPolicyUpdateRequest;
};

export type PrivacyPolicyUpdateQuery = {
  __typename?: 'PrivacyPolicyUpdateQuery';
  findAll: Array<PrivacyPolicyUpdate>;
  findLatest?: Maybe<PrivacyPolicyUpdate>;
  findOne?: Maybe<PrivacyPolicyUpdate>;
};


export type PrivacyPolicyUpdateQueryFindOneArgs = {
  privacyPolicyUpdateId: Scalars['String']['input'];
};

export type PublicCook = {
  __typename?: 'PublicCook';
  biography: Scalars['String']['output'];
  city: Scalars['String']['output'];
  cookId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  languages: Array<Language>;
  location: Location;
  maximumParticipants?: Maybe<Scalars['UnsignedInt']['output']>;
  maximumPrice?: Maybe<Scalars['UnsignedInt']['output']>;
  maximumTravelDistance?: Maybe<Scalars['UnsignedInt']['output']>;
  menuCount: Scalars['UnsignedInt']['output'];
  menus: Array<PublicMenu>;
  minimumParticipants?: Maybe<Scalars['UnsignedInt']['output']>;
  minimumPrice?: Maybe<Scalars['UnsignedInt']['output']>;
  rank: CookRank;
  travelExpenses: Scalars['UnsignedInt']['output'];
  user: PublicUser;
};

export type PublicCookQuery = {
  __typename?: 'PublicCookQuery';
  checkAvailability: Scalars['Boolean']['output'];
  findHeroes: Array<PublicCook>;
  findMany: Array<PublicCook>;
  findOne?: Maybe<PublicCook>;
};


export type PublicCookQueryCheckAvailabilityArgs = {
  request: FindManyPublicCooksRequest;
};


export type PublicCookQueryFindManyArgs = {
  request: FindManyPublicCooksRequest;
};


export type PublicCookQueryFindOneArgs = {
  cookId: Scalars['String']['input'];
};

export type PublicMenu = {
  __typename?: 'PublicMenu';
  basePrice: Scalars['UnsignedInt']['output'];
  basePriceCustomers: Scalars['UnsignedInt']['output'];
  categories: Array<Category>;
  cook: PublicCook;
  cookId: Scalars['String']['output'];
  courseCount: Scalars['UnsignedInt']['output'];
  courses: Array<Course>;
  createdAt: Scalars['DateTime']['output'];
  currencyCode: CurrencyCode;
  description: Scalars['String']['output'];
  greetingFromKitchen?: Maybe<Scalars['String']['output']>;
  imageUrls: Array<Scalars['URL']['output']>;
  kitchen?: Maybe<Kitchen>;
  menuId: Scalars['String']['output'];
  preparationTime: Scalars['UnsignedInt']['output'];
  pricePerAdult: Scalars['UnsignedInt']['output'];
  pricePerChild?: Maybe<Scalars['UnsignedInt']['output']>;
  title: Scalars['String']['output'];
};

export type PublicMenuQuery = {
  __typename?: 'PublicMenuQuery';
  checkAvailability: Scalars['Boolean']['output'];
  findHeroes: Array<PublicMenu>;
  findMany: Array<PublicMenu>;
  findOne?: Maybe<PublicMenu>;
};


export type PublicMenuQueryCheckAvailabilityArgs = {
  request: FindManyPublicMenusRequest;
};


export type PublicMenuQueryFindManyArgs = {
  request: FindManyPublicMenusRequest;
};


export type PublicMenuQueryFindOneArgs = {
  menuId: Scalars['String']['input'];
};

export type PublicPrivacyPolicyUpdate = {
  __typename?: 'PublicPrivacyPolicyUpdate';
  createdAt: Scalars['DateTime']['output'];
  englishText: Scalars['String']['output'];
  germanText: Scalars['String']['output'];
  privacyPolicyUpdateId: Scalars['String']['output'];
};

export type PublicPrivacyPolicyUpdateQuery = {
  __typename?: 'PublicPrivacyPolicyUpdateQuery';
  findAll: Array<PublicPrivacyPolicyUpdate>;
  findLatest?: Maybe<PublicPrivacyPolicyUpdate>;
  findOne?: Maybe<PublicPrivacyPolicyUpdate>;
};


export type PublicPrivacyPolicyUpdateQueryFindOneArgs = {
  privacyPolicyUpdateId: Scalars['String']['input'];
};

export type PublicTermsUpdate = {
  __typename?: 'PublicTermsUpdate';
  createdAt: Scalars['DateTime']['output'];
  englishText: Scalars['String']['output'];
  germanText: Scalars['String']['output'];
  termsUpdateId: Scalars['String']['output'];
};

export type PublicTermsUpdateQuery = {
  __typename?: 'PublicTermsUpdateQuery';
  findAll: Array<PublicTermsUpdate>;
  findLatest?: Maybe<PublicTermsUpdate>;
  findOne?: Maybe<PublicTermsUpdate>;
};


export type PublicTermsUpdateQueryFindOneArgs = {
  termsUpdateId: Scalars['String']['input'];
};

export type PublicUser = {
  __typename?: 'PublicUser';
  firstName: Scalars['String']['output'];
  profilePictureUrl?: Maybe<Scalars['URL']['output']>;
  userId: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  admins: AdminQuery;
  allergies: AllergyQuery;
  bookingRequests: BookingRequestQuery;
  categories: CategoryQuery;
  cookSpecificFees: CookSpecificFeeQuery;
  cooks: CookQuery;
  customerFeeUpdates: CustomerFeeUpdateQuery;
  globalBookingRequests: GlobalBookingRequestQuery;
  kitchens: KitchenQuery;
  languages: LanguageQuery;
  privacyPolicyUpdates: PrivacyPolicyUpdateQuery;
  publicCooks: PublicCookQuery;
  publicMenus: PublicMenuQuery;
  publicPrivacyPolicyUpdates: PublicPrivacyPolicyUpdateQuery;
  publicTermsUpdates: PublicTermsUpdateQuery;
  searchRequests: SearchRequestQuery;
  sessions: SessionQuery;
  stripePublishableKey?: Maybe<Scalars['String']['output']>;
  supportRequests: SupportRequestQuery;
  termsUpdates: TermsUpdateQuery;
  users: UserQuery;
};

export type SearchRequest = {
  __typename?: 'SearchRequest';
  adults: Scalars['UnsignedInt']['output'];
  children: Scalars['UnsignedInt']['output'];
  createdAt: Scalars['DateTime']['output'];
  date: Scalars['Date']['output'];
  locationText: Scalars['String']['output'];
  origin: SearchRequestOrigin;
  searchRequestId?: Maybe<Scalars['String']['output']>;
};

export type SearchRequestMutation = {
  __typename?: 'SearchRequestMutation';
  createOne: Scalars['Boolean']['output'];
};


export type SearchRequestMutationCreateOneArgs = {
  request: CreateOneSearchRequestRequest;
};

export type SearchRequestOrigin =
  | 'HOME'
  | 'PUBLIC_COOKS'
  | 'PUBLIC_MENUS';

export type SearchRequestQuery = {
  __typename?: 'SearchRequestQuery';
  findAll: Array<SearchRequest>;
};

export type Session = {
  __typename?: 'Session';
  cookieSettings?: Maybe<SessionCookieSettings>;
  createdAt: Scalars['DateTime']['output'];
  expired: Scalars['Boolean']['output'];
  lastExtendedAt: Scalars['DateTime']['output'];
  platform: Platform;
  sessionId: Scalars['String']['output'];
  title?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type SessionCookieSettings = {
  __typename?: 'SessionCookieSettings';
  googleAnalytics?: Maybe<Scalars['Boolean']['output']>;
  sessionCookie?: Maybe<Scalars['Boolean']['output']>;
};

export type SessionCookieSettingsInput = {
  googleAnalytics?: InputMaybe<Scalars['Boolean']['input']>;
  sessionCookie?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SessionMutation = {
  __typename?: 'SessionMutation';
  assignOneByEmailAddress: Scalars['Boolean']['output'];
  assignOneByIdentityProvider: Scalars['Boolean']['output'];
  assignOneByPhoneNumber: Scalars['Boolean']['output'];
  updateCookieSettings: Scalars['Boolean']['output'];
};


export type SessionMutationAssignOneByEmailAddressArgs = {
  request: CreateOneSessionByEmailAddressRequest;
};


export type SessionMutationAssignOneByIdentityProviderArgs = {
  request: CreateOneSessionByIdentityProviderRequest;
};


export type SessionMutationAssignOneByPhoneNumberArgs = {
  request: CreateOneSessionByPhoneNumberRequest;
};


export type SessionMutationUpdateCookieSettingsArgs = {
  request: SessionCookieSettingsInput;
};

export type SessionQuery = {
  __typename?: 'SessionQuery';
  current?: Maybe<Session>;
};

export type Subscription = {
  __typename?: 'Subscription';
  bookingRequestChatMessageCreations: ChatMessage;
};


export type SubscriptionBookingRequestChatMessageCreationsArgs = {
  bookingRequestId: Scalars['String']['input'];
};

export type SupportRequest = {
  __typename?: 'SupportRequest';
  bookingRequestId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  message: Scalars['String']['output'];
  subject: Scalars['String']['output'];
  supportRequestId: Scalars['String']['output'];
  user: PublicUser;
  userId: Scalars['String']['output'];
};

export type SupportRequestQuery = {
  __typename?: 'SupportRequestQuery';
  findMany?: Maybe<Array<SupportRequest>>;
  findOne?: Maybe<SupportRequest>;
};


export type SupportRequestQueryFindManyArgs = {
  request?: InputMaybe<FindManyRequest>;
};


export type SupportRequestQueryFindOneArgs = {
  supportRequestId: Scalars['String']['input'];
};

export type TermsUpdate = {
  __typename?: 'TermsUpdate';
  admin: Admin;
  adminId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  englishText: Scalars['String']['output'];
  germanText: Scalars['String']['output'];
  termsUpdateId: Scalars['String']['output'];
};

export type TermsUpdateMutation = {
  __typename?: 'TermsUpdateMutation';
  createOne: Scalars['Boolean']['output'];
};


export type TermsUpdateMutationCreateOneArgs = {
  request: CreateOneTermsUpdateRequest;
};

export type TermsUpdateQuery = {
  __typename?: 'TermsUpdateQuery';
  findAll: Array<TermsUpdate>;
  findLatest?: Maybe<TermsUpdate>;
  findOne?: Maybe<TermsUpdate>;
};


export type TermsUpdateQueryFindOneArgs = {
  termsUpdateId: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  acceptedPrivacyPolicy: Scalars['DateTime']['output'];
  acceptedTerms: Scalars['DateTime']['output'];
  activeSessionCount: Scalars['UnsignedInt']['output'];
  activeSessions: Array<Session>;
  addressCount: Scalars['UnsignedInt']['output'];
  addresses: Array<Address>;
  admin?: Maybe<Admin>;
  birthDate?: Maybe<Scalars['Date']['output']>;
  bookingRequests: Array<BookingRequest>;
  cook?: Maybe<Cook>;
  createdAt: Scalars['DateTime']['output'];
  emailAddress?: Maybe<Scalars['EmailAddress']['output']>;
  emailAddressUpdate?: Maybe<EmailAddressUpdate>;
  firstName: Scalars['String']['output'];
  followingCount: Scalars['UnsignedInt']['output'];
  followings: Array<Following>;
  gender: Gender;
  isAdmin: Scalars['Boolean']['output'];
  isCook: Scalars['Boolean']['output'];
  isLocked: Scalars['Boolean']['output'];
  language: UserLanguage;
  lastName: Scalars['String']['output'];
  notificationConfiguration: NotificationConfiguration;
  notifications: Array<Notification>;
  oneTimeAccessToken?: Maybe<OneTimeAccessToken>;
  phoneNumber?: Maybe<Scalars['PhoneNumber']['output']>;
  phoneNumberUpdate?: Maybe<PhoneNumberUpdate>;
  profilePictureUrl?: Maybe<Scalars['URL']['output']>;
  unreadNotificationCount: Scalars['UnsignedInt']['output'];
  userId: Scalars['String']['output'];
};

export type UserAddressMutation = {
  __typename?: 'UserAddressMutation';
  createOne: Scalars['Boolean']['output'];
  deleteOne: Scalars['Boolean']['output'];
  update: Scalars['Boolean']['output'];
  userId: Scalars['String']['output'];
};


export type UserAddressMutationCreateOneArgs = {
  address: CreateOneAddressRequest;
};


export type UserAddressMutationDeleteOneArgs = {
  addressId: Scalars['String']['input'];
};


export type UserAddressMutationUpdateArgs = {
  address: CreateOneAddressRequest;
  addressId: Scalars['String']['input'];
};

export type UserAddressQuery = {
  __typename?: 'UserAddressQuery';
  findMany?: Maybe<Array<Address>>;
  userId: Scalars['String']['output'];
};


export type UserAddressQueryFindManyArgs = {
  request?: InputMaybe<FindManyRequest>;
};

export type UserBookingRequestChatMessageMutation = {
  __typename?: 'UserBookingRequestChatMessageMutation';
  bookingRequestId: Scalars['String']['output'];
  createOne: Scalars['Boolean']['output'];
  userId: Scalars['String']['output'];
};


export type UserBookingRequestChatMessageMutationCreateOneArgs = {
  request: CreateChatMessageRequest;
};

export type UserBookingRequestChatMessageQuery = {
  __typename?: 'UserBookingRequestChatMessageQuery';
  bookingRequestId: Scalars['String']['output'];
  findMany?: Maybe<Array<ChatMessage>>;
  userId: Scalars['String']['output'];
};


export type UserBookingRequestChatMessageQueryFindManyArgs = {
  request?: InputMaybe<FindManyRequest>;
};

export type UserBookingRequestMutation = {
  __typename?: 'UserBookingRequestMutation';
  accept: Scalars['Boolean']['output'];
  chatMessages: UserBookingRequestChatMessageMutation;
  confirmPaymentSetup: Scalars['Boolean']['output'];
  createOne: UserCreateOneBookingRequestResponse;
  decline: Scalars['Boolean']['output'];
  updatePrice: Scalars['Boolean']['output'];
  userId: Scalars['String']['output'];
};


export type UserBookingRequestMutationAcceptArgs = {
  bookingRequestId: Scalars['String']['input'];
};


export type UserBookingRequestMutationChatMessagesArgs = {
  bookingRequestId: Scalars['String']['input'];
};


export type UserBookingRequestMutationConfirmPaymentSetupArgs = {
  bookingRequestId: Scalars['String']['input'];
};


export type UserBookingRequestMutationCreateOneArgs = {
  request: CreateBookingRequestRequest;
};


export type UserBookingRequestMutationDeclineArgs = {
  bookingRequestId: Scalars['String']['input'];
};


export type UserBookingRequestMutationUpdatePriceArgs = {
  bookingRequestId: Scalars['String']['input'];
  price: PriceInput;
};

export type UserBookingRequestQuery = {
  __typename?: 'UserBookingRequestQuery';
  chatMessages: UserBookingRequestChatMessageQuery;
  findMany?: Maybe<Array<BookingRequest>>;
  findOne?: Maybe<BookingRequest>;
  userId: Scalars['String']['output'];
};


export type UserBookingRequestQueryChatMessagesArgs = {
  bookingRequestId: Scalars['String']['input'];
};


export type UserBookingRequestQueryFindManyArgs = {
  request?: InputMaybe<FindManyRequest>;
};


export type UserBookingRequestQueryFindOneArgs = {
  bookingRequestId: Scalars['String']['input'];
};

export type UserCookRatingQuery = {
  __typename?: 'UserCookRatingQuery';
  findMany: Array<CookRating>;
  userId: Scalars['String']['output'];
};

export type UserCookVisitQuery = {
  __typename?: 'UserCookVisitQuery';
  findMany?: Maybe<Array<Address>>;
  userId: Scalars['String']['output'];
};


export type UserCookVisitQueryFindManyArgs = {
  request?: InputMaybe<FindManyRequest>;
};

export type UserCreateOneBookingRequestResponse = {
  __typename?: 'UserCreateOneBookingRequestResponse';
  bookingRequestId: Scalars['String']['output'];
  clientSecret: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type UserEmailAddressUpdateMutation = {
  __typename?: 'UserEmailAddressUpdateMutation';
  confirm: Scalars['Boolean']['output'];
  createOne: Scalars['Boolean']['output'];
  deleteOne: Scalars['Boolean']['output'];
  userId: Scalars['String']['output'];
};


export type UserEmailAddressUpdateMutationConfirmArgs = {
  secret: Scalars['String']['input'];
};


export type UserEmailAddressUpdateMutationCreateOneArgs = {
  emailAddress: Scalars['EmailAddress']['input'];
};

export type UserEmailAddressUpdateQuery = {
  __typename?: 'UserEmailAddressUpdateQuery';
  findOne?: Maybe<EmailAddressUpdate>;
  userId: Scalars['String']['output'];
};

export type UserFollowingMutation = {
  __typename?: 'UserFollowingMutation';
  createOne: Scalars['Boolean']['output'];
  deleteOne: Scalars['Boolean']['output'];
  userId: Scalars['String']['output'];
};


export type UserFollowingMutationCreateOneArgs = {
  cookId: Scalars['String']['input'];
};


export type UserFollowingMutationDeleteOneArgs = {
  cookId: Scalars['String']['input'];
};

export type UserFollowingQuery = {
  __typename?: 'UserFollowingQuery';
  findAll: Array<Following>;
  userId: Scalars['String']['output'];
};

export type UserGlobalBookingRequestMutation = {
  __typename?: 'UserGlobalBookingRequestMutation';
  createOne: Scalars['Boolean']['output'];
  expireOne: Scalars['Boolean']['output'];
  updateDateTime: Scalars['Boolean']['output'];
  updateMessage: Scalars['Boolean']['output'];
  updateOccasion: Scalars['Boolean']['output'];
  updatePriceClass: Scalars['Boolean']['output'];
  userId: Scalars['String']['output'];
};


export type UserGlobalBookingRequestMutationCreateOneArgs = {
  request: CreateOneGlobalBookingRequestRequest;
};


export type UserGlobalBookingRequestMutationExpireOneArgs = {
  globalBookingRequestId: Scalars['String']['input'];
};


export type UserGlobalBookingRequestMutationUpdateDateTimeArgs = {
  dateTime: Scalars['DateTime']['input'];
  globalBookingRequestId: Scalars['String']['input'];
};


export type UserGlobalBookingRequestMutationUpdateMessageArgs = {
  globalBookingRequestId: Scalars['String']['input'];
  message: Scalars['String']['input'];
};


export type UserGlobalBookingRequestMutationUpdateOccasionArgs = {
  globalBookingRequestId: Scalars['String']['input'];
  occasion: Scalars['String']['input'];
};


export type UserGlobalBookingRequestMutationUpdatePriceClassArgs = {
  globalBookingRequestId: Scalars['String']['input'];
  priceClassType: GlobalBookingRequestPriceClassType;
};

export type UserGlobalBookingRequestQuery = {
  __typename?: 'UserGlobalBookingRequestQuery';
  findMany?: Maybe<Array<GlobalBookingRequest>>;
  findOne?: Maybe<GlobalBookingRequest>;
  userId: Scalars['String']['output'];
};

export type UserLanguage =
  | 'ENGLISH'
  | 'GERMAN';

export type UserMenuVisitQuery = {
  __typename?: 'UserMenuVisitQuery';
  findMany?: Maybe<Array<Address>>;
  userId: Scalars['String']['output'];
};


export type UserMenuVisitQueryFindManyArgs = {
  request?: InputMaybe<FindManyRequest>;
};

export type UserMutation = {
  __typename?: 'UserMutation';
  acceptLatestPrivacyPolicy: Scalars['Boolean']['output'];
  acceptLatestTerms: Scalars['Boolean']['output'];
  addresses: UserAddressMutation;
  bookingRequests: UserBookingRequestMutation;
  createOneByEmailAddress: Scalars['Boolean']['output'];
  createOneByIdentityProvider: Scalars['Boolean']['output'];
  createOneByPhoneNumber: Scalars['Boolean']['output'];
  emailAddressUpdate: UserEmailAddressUpdateMutation;
  followings: UserFollowingMutation;
  globalBookingRequests: UserGlobalBookingRequestMutation;
  notificationConfiguration: NotificationConfigurationMutation;
  notifications: UserNotificationMutation;
  oneTimeAccessToken: UserOneTimeAccessTokenMutation;
  phoneNumberUpdate: UserPhoneNumberUpdateMutation;
  sessions: UserSessionMutation;
  supportRequests: UserSupportRequestMutation;
  updateGender: Scalars['Boolean']['output'];
  updateIsLocked: Scalars['Boolean']['output'];
  updatePassword: Scalars['Boolean']['output'];
  updateProfilePicture: Scalars['Boolean']['output'];
};


export type UserMutationAddressesArgs = {
  userId: Scalars['String']['input'];
};


export type UserMutationBookingRequestsArgs = {
  userId: Scalars['String']['input'];
};


export type UserMutationCreateOneByEmailAddressArgs = {
  profilePicture?: InputMaybe<Scalars['Upload']['input']>;
  request: CreateOneUserByEmailAddressRequest;
};


export type UserMutationCreateOneByIdentityProviderArgs = {
  request: CreateOneUserByIdentityProviderRequest;
};


export type UserMutationCreateOneByPhoneNumberArgs = {
  request: CreateOneUserByPhoneNumberRequest;
};


export type UserMutationEmailAddressUpdateArgs = {
  userId: Scalars['String']['input'];
};


export type UserMutationFollowingsArgs = {
  userId: Scalars['String']['input'];
};


export type UserMutationGlobalBookingRequestsArgs = {
  userId: Scalars['String']['input'];
};


export type UserMutationNotificationConfigurationArgs = {
  userId: Scalars['String']['input'];
};


export type UserMutationNotificationsArgs = {
  userId: Scalars['String']['input'];
};


export type UserMutationOneTimeAccessTokenArgs = {
  userId: Scalars['String']['input'];
};


export type UserMutationPhoneNumberUpdateArgs = {
  userId: Scalars['String']['input'];
};


export type UserMutationSessionsArgs = {
  userId: Scalars['String']['input'];
};


export type UserMutationSupportRequestsArgs = {
  userId: Scalars['String']['input'];
};


export type UserMutationUpdateGenderArgs = {
  gender: Gender;
  userId: Scalars['String']['input'];
};


export type UserMutationUpdateIsLockedArgs = {
  isLocked: Scalars['Boolean']['input'];
  userId: Scalars['String']['input'];
};


export type UserMutationUpdatePasswordArgs = {
  password: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type UserMutationUpdateProfilePictureArgs = {
  profilePicture?: InputMaybe<Scalars['Upload']['input']>;
  userId: Scalars['String']['input'];
};

export type UserNotificationMutation = {
  __typename?: 'UserNotificationMutation';
  deleteAll: Scalars['Boolean']['output'];
  deleteOne: Scalars['Boolean']['output'];
  updateAllWasRead: Scalars['Boolean']['output'];
  updateOneWasRead: Scalars['Boolean']['output'];
  userId: Scalars['String']['output'];
};


export type UserNotificationMutationDeleteOneArgs = {
  notificationId: Scalars['String']['input'];
};


export type UserNotificationMutationUpdateAllWasReadArgs = {
  wasRead: Scalars['Boolean']['input'];
};


export type UserNotificationMutationUpdateOneWasReadArgs = {
  notificationId: Scalars['String']['input'];
  wasRead: Scalars['Boolean']['input'];
};

export type UserOneTimeAccessTokenMutation = {
  __typename?: 'UserOneTimeAccessTokenMutation';
  confirm: Scalars['Boolean']['output'];
  createOneForEmailAddress: Scalars['Boolean']['output'];
  createOneForPhoneNumber: Scalars['Boolean']['output'];
  deleteOne: Scalars['Boolean']['output'];
  userId: Scalars['String']['output'];
};


export type UserOneTimeAccessTokenMutationConfirmArgs = {
  secret: Scalars['String']['input'];
};


export type UserOneTimeAccessTokenMutationCreateOneForEmailAddressArgs = {
  emailAddress: Scalars['EmailAddress']['input'];
};


export type UserOneTimeAccessTokenMutationCreateOneForPhoneNumberArgs = {
  phoneNumber: Scalars['PhoneNumber']['input'];
};

export type UserOneTimeAccessTokenQuery = {
  __typename?: 'UserOneTimeAccessTokenQuery';
  findOne?: Maybe<OneTimeAccessToken>;
  userId: Scalars['String']['output'];
};

export type UserPhoneNumberUpdateMutation = {
  __typename?: 'UserPhoneNumberUpdateMutation';
  confirm: Scalars['Boolean']['output'];
  createOne: Scalars['Boolean']['output'];
  deleteOne: Scalars['Boolean']['output'];
  userId: Scalars['String']['output'];
};


export type UserPhoneNumberUpdateMutationConfirmArgs = {
  secret: Scalars['String']['input'];
};


export type UserPhoneNumberUpdateMutationCreateOneArgs = {
  phoneNumber: Scalars['PhoneNumber']['input'];
};

export type UserPhoneNumberUpdateQuery = {
  __typename?: 'UserPhoneNumberUpdateQuery';
  findOne?: Maybe<PhoneNumberUpdate>;
  userId: Scalars['String']['output'];
};

export type UserQuery = {
  __typename?: 'UserQuery';
  addresses: UserAddressQuery;
  bookingRequests: UserBookingRequestQuery;
  cookRatings: UserCookRatingQuery;
  cookVisits: UserAddressQuery;
  emailAddressUpdate: UserEmailAddressUpdateQuery;
  findMany?: Maybe<Array<User>>;
  findOne?: Maybe<User>;
  followings: UserFollowingQuery;
  globalBookingRequests: UserGlobalBookingRequestQuery;
  me?: Maybe<User>;
  menuVisits: UserAddressQuery;
  notificationConfiguration?: Maybe<NotificationConfigurationQuery>;
  notifications: NotificationQuery;
  oneTimeAccessToken: UserOneTimeAccessTokenQuery;
  phoneNumberUpdate: UserPhoneNumberUpdateQuery;
  sessions: UserSessionQuery;
  userRatings: UserUserRatingQuery;
};


export type UserQueryAddressesArgs = {
  userId: Scalars['String']['input'];
};


export type UserQueryBookingRequestsArgs = {
  userId: Scalars['String']['input'];
};


export type UserQueryCookRatingsArgs = {
  userId: Scalars['String']['input'];
};


export type UserQueryCookVisitsArgs = {
  userId: Scalars['String']['input'];
};


export type UserQueryEmailAddressUpdateArgs = {
  userId: Scalars['String']['input'];
};


export type UserQueryFindManyArgs = {
  request: FindManyRequest;
};


export type UserQueryFindOneArgs = {
  userId: Scalars['String']['input'];
};


export type UserQueryFollowingsArgs = {
  userId: Scalars['String']['input'];
};


export type UserQueryGlobalBookingRequestsArgs = {
  userId: Scalars['String']['input'];
};


export type UserQueryMenuVisitsArgs = {
  userId: Scalars['String']['input'];
};


export type UserQueryNotificationConfigurationArgs = {
  userId: Scalars['String']['input'];
};


export type UserQueryNotificationsArgs = {
  userId: Scalars['String']['input'];
};


export type UserQueryOneTimeAccessTokenArgs = {
  userId: Scalars['String']['input'];
};


export type UserQueryPhoneNumberUpdateArgs = {
  userId: Scalars['String']['input'];
};


export type UserQuerySessionsArgs = {
  userId: Scalars['String']['input'];
};


export type UserQueryUserRatingsArgs = {
  userId: Scalars['String']['input'];
};

export type UserRating = {
  __typename?: 'UserRating';
  bookingRequest: BookingRequest;
  bookingRequestId: Scalars['String']['output'];
  comment?: Maybe<Scalars['String']['output']>;
  cook: PublicCook;
  cookId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  user: PublicUser;
  userId: Scalars['String']['output'];
  value: Scalars['UnsignedInt']['output'];
};

export type UserSessionMutation = {
  __typename?: 'UserSessionMutation';
  expireCurrent: Scalars['Boolean']['output'];
  expireMany: Scalars['Boolean']['output'];
  expireOne: Scalars['Boolean']['output'];
  userId: Scalars['String']['output'];
};


export type UserSessionMutationExpireManyArgs = {
  request: Array<Scalars['String']['input']>;
};


export type UserSessionMutationExpireOneArgs = {
  request: ExpireOneSessionRequest;
};

export type UserSessionQuery = {
  __typename?: 'UserSessionQuery';
  findMany?: Maybe<Array<Session>>;
  userId: Scalars['String']['output'];
};

export type UserSupportRequestMutation = {
  __typename?: 'UserSupportRequestMutation';
  createOne: Scalars['Boolean']['output'];
  userId: Scalars['String']['output'];
};


export type UserSupportRequestMutationCreateOneArgs = {
  request: CreateOneSupportRequest;
};

export type UserUserRatingQuery = {
  __typename?: 'UserUserRatingQuery';
  findMany: Array<UserRating>;
  userId: Scalars['String']['output'];
};

export type AllergyOptionFragment = { __typename?: 'Allergy', allergyId: string, title: string };

export type CategoryOptionFragment = { __typename?: 'Category', categoryId: string, title: string };

export type KitchenOptionFragment = { __typename?: 'Kitchen', kitchenId: string, title: string };

export type LanguageOptionFragment = { __typename?: 'Language', languageId: string, title: string };

export type SignedInUserFragment = { __typename?: 'User', userId: string, firstName: string, profilePictureUrl?: string | null, isCook: boolean, isAdmin: boolean };

export type AssignOneSessionByEmailAddressMutationVariables = Exact<{
  request: CreateOneSessionByEmailAddressRequest;
}>;


export type AssignOneSessionByEmailAddressMutation = { __typename?: 'Mutation', sessions: { __typename?: 'SessionMutation', success: boolean } };

export type CreateOneCookMutationVariables = Exact<{
  cookId: Scalars['String']['input'];
  request: CreateOneCookRequest;
}>;


export type CreateOneCookMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', success: boolean } };

export type CreateOneUserByEmailAddressMutationVariables = Exact<{
  request: CreateOneUserByEmailAddressRequest;
  profilePicture?: InputMaybe<Scalars['Upload']['input']>;
}>;


export type CreateOneUserByEmailAddressMutation = { __typename?: 'Mutation', users: { __typename?: 'UserMutation', success: boolean } };

export type ExpireCurrentSessionMutationVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type ExpireCurrentSessionMutation = { __typename?: 'Mutation', users: { __typename?: 'UserMutation', sessions: { __typename?: 'UserSessionMutation', success: boolean } } };

export type CreateOneUserBookingRequestMutationVariables = Exact<{
  request: CreateBookingRequestRequest;
  userId: Scalars['String']['input'];
}>;


export type CreateOneUserBookingRequestMutation = { __typename?: 'Mutation', users: { __typename?: 'UserMutation', bookingRequests: { __typename?: 'UserBookingRequestMutation', createOne: { __typename?: 'UserCreateOneBookingRequestResponse', success: boolean, clientSecret: string, bookingRequestId: string } } } };

export type CreateOneUserGlobalBookingRequestMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  request: CreateOneGlobalBookingRequestRequest;
}>;


export type CreateOneUserGlobalBookingRequestMutation = { __typename?: 'Mutation', users: { __typename?: 'UserMutation', globalBookingRequests: { __typename?: 'UserGlobalBookingRequestMutation', success: boolean } } };

export type UpdateCookBiographyMutationVariables = Exact<{
  cookId: Scalars['String']['input'];
  biography: Scalars['String']['input'];
}>;


export type UpdateCookBiographyMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', success: boolean } };

export type UpdateCookIsVisibleMutationVariables = Exact<{
  cookId: Scalars['String']['input'];
  isVisible: Scalars['Boolean']['input'];
}>;


export type UpdateCookIsVisibleMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', success: boolean } };

export type UpdateCookLocationMutationVariables = Exact<{
  cookId: Scalars['String']['input'];
  location: LocationInput;
}>;


export type UpdateCookLocationMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', success: boolean } };

export type UpdateCookMaximumParticipantsMutationVariables = Exact<{
  cookId: Scalars['String']['input'];
  maximumParticipants?: InputMaybe<Scalars['UnsignedInt']['input']>;
}>;


export type UpdateCookMaximumParticipantsMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', success: boolean } };

export type UpdateCookMaximumPriceMutationVariables = Exact<{
  cookId: Scalars['String']['input'];
}>;


export type UpdateCookMaximumPriceMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', success: boolean } };

export type UpdateCookMaximumTravelDistanceMutationVariables = Exact<{
  cookId: Scalars['String']['input'];
  maximumTravelDistance?: InputMaybe<Scalars['UnsignedInt']['input']>;
}>;


export type UpdateCookMaximumTravelDistanceMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', success: boolean } };

export type UpdateCookMinimumParticipantsMutationVariables = Exact<{
  cookId: Scalars['String']['input'];
}>;


export type UpdateCookMinimumParticipantsMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', success: boolean } };

export type UpdateCookMinimumPriceMutationVariables = Exact<{
  cookId: Scalars['String']['input'];
}>;


export type UpdateCookMinimumPriceMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', success: boolean } };

export type UpdateCookRankMutationVariables = Exact<{
  cookId: Scalars['String']['input'];
  rank: CookRank;
}>;


export type UpdateCookRankMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', success: boolean } };

export type UpdateCookTravelExpensesMutationVariables = Exact<{
  cookId: Scalars['String']['input'];
  travelExpenses: Scalars['UnsignedInt']['input'];
}>;


export type UpdateCookTravelExpensesMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', success: boolean } };

export type CreateOneUserAddressMutationVariables = Exact<{
  address: CreateOneAddressRequest;
  userId: Scalars['String']['input'];
}>;


export type CreateOneUserAddressMutation = { __typename?: 'Mutation', users: { __typename?: 'UserMutation', addresses: { __typename?: 'UserAddressMutation', success: boolean } } };

export type DeleteOneUserAddressMutationVariables = Exact<{
  addressId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
}>;


export type DeleteOneUserAddressMutation = { __typename?: 'Mutation', users: { __typename?: 'UserMutation', addresses: { __typename?: 'UserAddressMutation', success: boolean } } };

export type AddOneCookLanguageMutationVariables = Exact<{
  cookId: Scalars['String']['input'];
  languageId: Scalars['String']['input'];
}>;


export type AddOneCookLanguageMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', success: boolean } };

export type RemoveOneCookLanguageMutationVariables = Exact<{
  cookId: Scalars['String']['input'];
  languageId: Scalars['String']['input'];
}>;


export type RemoveOneCookLanguageMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', success: boolean } };

export type ConfirmOneEmailAddressUpdateMutationVariables = Exact<{
  secret: Scalars['String']['input'];
}>;


export type ConfirmOneEmailAddressUpdateMutation = { __typename?: 'Mutation', users: { __typename?: 'UserMutation', emailAddressUpdate: { __typename?: 'UserEmailAddressUpdateMutation', success: boolean } } };

export type CreateOneEmailAddressUpdateMutationVariables = Exact<{
  emailAddress: Scalars['EmailAddress']['input'];
  userId: Scalars['String']['input'];
}>;


export type CreateOneEmailAddressUpdateMutation = { __typename?: 'Mutation', users: { __typename?: 'UserMutation', emailAddressUpdate: { __typename?: 'UserEmailAddressUpdateMutation', success: boolean } } };

export type CreateMealMutationVariables = Exact<{
  meal: CreateOneMealRequest;
  cookId: Scalars['String']['input'];
  image?: InputMaybe<Scalars['Upload']['input']>;
}>;


export type CreateMealMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', meals: { __typename?: 'CookMealMutation', success: boolean } } };

export type DeleteOneCookMealMutationVariables = Exact<{
  mealId: Scalars['String']['input'];
  cookId: Scalars['String']['input'];
}>;


export type DeleteOneCookMealMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', meals: { __typename?: 'CookMealMutation', success: boolean } } };

export type UpdateCookMealDescriptionMutationVariables = Exact<{
  mealId: Scalars['String']['input'];
  description: Scalars['String']['input'];
  cookId: Scalars['String']['input'];
}>;


export type UpdateCookMealDescriptionMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', meals: { __typename?: 'CookMealMutation', success: boolean } } };

export type UpdateCookMealImageMutationVariables = Exact<{
  mealId: Scalars['String']['input'];
  cookId: Scalars['String']['input'];
  image?: InputMaybe<Scalars['Upload']['input']>;
}>;


export type UpdateCookMealImageMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', meals: { __typename?: 'CookMealMutation', success: boolean } } };

export type UpdateCookMealTitleMutationVariables = Exact<{
  mealId: Scalars['String']['input'];
  title: Scalars['String']['input'];
  cookId: Scalars['String']['input'];
}>;


export type UpdateCookMealTitleMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', meals: { __typename?: 'CookMealMutation', success: boolean } } };

export type UpdateCookMealTypeMutationVariables = Exact<{
  mealId: Scalars['String']['input'];
  type: MealType;
  cookId: Scalars['String']['input'];
}>;


export type UpdateCookMealTypeMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', meals: { __typename?: 'CookMealMutation', success: boolean } } };

export type CreateManyCookMenuCourseMealOptionsMutationVariables = Exact<{
  menuId: Scalars['String']['input'];
  cookId: Scalars['String']['input'];
  mealOptions: Array<CreateOneMealOptionRequest> | CreateOneMealOptionRequest;
  courseId: Scalars['String']['input'];
}>;


export type CreateManyCookMenuCourseMealOptionsMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', menus: { __typename?: 'CookMenuMutation', courses: { __typename?: 'CookMenuCourseMutation', mealOptions: { __typename?: 'CookMenuCourseMealOptionMutation', success: boolean } } } } };

export type CreateOneCookMenuMutationVariables = Exact<{
  menu: CreateOneMenuRequest;
  cookId: Scalars['String']['input'];
}>;


export type CreateOneCookMenuMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', menus: { __typename?: 'CookMenuMutation', success: boolean } } };

export type CreateOneCookMenuCourseMutationVariables = Exact<{
  request: CreateOneCourseRequest;
  menuId: Scalars['String']['input'];
  cookId: Scalars['String']['input'];
}>;


export type CreateOneCookMenuCourseMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', menus: { __typename?: 'CookMenuMutation', courses: { __typename?: 'CookMenuCourseMutation', success: boolean } } } };

export type DeleteOneCookMenuMutationVariables = Exact<{
  menuId: Scalars['String']['input'];
  cookId: Scalars['String']['input'];
}>;


export type DeleteOneCookMenuMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', menus: { __typename?: 'CookMenuMutation', success: boolean } } };

export type DeleteOneCookMenuCourseMutationVariables = Exact<{
  courseId: Scalars['String']['input'];
  menuId: Scalars['String']['input'];
  cookId: Scalars['String']['input'];
}>;


export type DeleteOneCookMenuCourseMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', menus: { __typename?: 'CookMenuMutation', courses: { __typename?: 'CookMenuCourseMutation', success: boolean } } } };

export type DeleteOneCookMenuCourseMealOptionMutationVariables = Exact<{
  mealId: Scalars['String']['input'];
  courseId: Scalars['String']['input'];
  menuId: Scalars['String']['input'];
  cookId: Scalars['String']['input'];
}>;


export type DeleteOneCookMenuCourseMealOptionMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', menus: { __typename?: 'CookMenuMutation', courses: { __typename?: 'CookMenuCourseMutation', mealOptions: { __typename?: 'CookMenuCourseMealOptionMutation', deleteOne: boolean } } } } };

export type UpdateCookMenuBasePriceMutationVariables = Exact<{
  menuId: Scalars['String']['input'];
  basePrice: Scalars['UnsignedInt']['input'];
  cookId: Scalars['String']['input'];
}>;


export type UpdateCookMenuBasePriceMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', menus: { __typename?: 'CookMenuMutation', success: boolean } } };

export type UpdateCookMenuBasePriceCustomersMutationVariables = Exact<{
  menuId: Scalars['String']['input'];
  basePriceCustomers: Scalars['UnsignedInt']['input'];
  cookId: Scalars['String']['input'];
}>;


export type UpdateCookMenuBasePriceCustomersMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', menus: { __typename?: 'CookMenuMutation', success: boolean } } };

export type UpdateCookMenuCourseTitleMutationVariables = Exact<{
  courseId: Scalars['String']['input'];
  title: Scalars['String']['input'];
  menuId: Scalars['String']['input'];
  cookId: Scalars['String']['input'];
}>;


export type UpdateCookMenuCourseTitleMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', menus: { __typename?: 'CookMenuMutation', courses: { __typename?: 'CookMenuCourseMutation', updateTitle: boolean } } } };

export type UpdateCookMenuCurrencyCodeMutationVariables = Exact<{
  menuId: Scalars['String']['input'];
  currencyCode: CurrencyCode;
  cookId: Scalars['String']['input'];
}>;


export type UpdateCookMenuCurrencyCodeMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', menus: { __typename?: 'CookMenuMutation', success: boolean } } };

export type UpdateCookMenuDescriptionMutationVariables = Exact<{
  menuId: Scalars['String']['input'];
  description: Scalars['String']['input'];
  cookId: Scalars['String']['input'];
}>;


export type UpdateCookMenuDescriptionMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', menus: { __typename?: 'CookMenuMutation', success: boolean } } };

export type UpdateCookMenuGreetingFromKitchenMutationVariables = Exact<{
  menuId: Scalars['String']['input'];
  cookId: Scalars['String']['input'];
  greetingFromKitchen?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateCookMenuGreetingFromKitchenMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', menus: { __typename?: 'CookMenuMutation', success: boolean } } };

export type UpdateCookMenuIsVisibleMutationVariables = Exact<{
  menuId: Scalars['String']['input'];
  isVisible: Scalars['Boolean']['input'];
  cookId: Scalars['String']['input'];
}>;


export type UpdateCookMenuIsVisibleMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', menus: { __typename?: 'CookMenuMutation', success: boolean } } };

export type UpdateCookMenuKitchenIdMutationVariables = Exact<{
  menuId: Scalars['String']['input'];
  cookId: Scalars['String']['input'];
  kitchenId?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateCookMenuKitchenIdMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', menus: { __typename?: 'CookMenuMutation', success: boolean } } };

export type UpdateCookMenuPreparationTimeMutationVariables = Exact<{
  menuId: Scalars['String']['input'];
  preparationTime: Scalars['UnsignedInt']['input'];
  cookId: Scalars['String']['input'];
}>;


export type UpdateCookMenuPreparationTimeMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', menus: { __typename?: 'CookMenuMutation', success: boolean } } };

export type UpdateCookMenuPricePerAdultMutationVariables = Exact<{
  menuId: Scalars['String']['input'];
  pricePerAdult: Scalars['UnsignedInt']['input'];
  cookId: Scalars['String']['input'];
}>;


export type UpdateCookMenuPricePerAdultMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', menus: { __typename?: 'CookMenuMutation', success: boolean } } };

export type UpdateCookMenuPricePerChildMutationVariables = Exact<{
  menuId: Scalars['String']['input'];
  cookId: Scalars['String']['input'];
  pricePerChild?: InputMaybe<Scalars['UnsignedInt']['input']>;
}>;


export type UpdateCookMenuPricePerChildMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', menus: { __typename?: 'CookMenuMutation', success: boolean } } };

export type UpdateCookMenuTitleMutationVariables = Exact<{
  menuId: Scalars['String']['input'];
  title: Scalars['String']['input'];
  cookId: Scalars['String']['input'];
}>;


export type UpdateCookMenuTitleMutation = { __typename?: 'Mutation', cooks: { __typename?: 'CookMutation', menus: { __typename?: 'CookMenuMutation', success: boolean } } };

export type ConfirmOneOneTimeAccessTokenMutationVariables = Exact<{
  secret: Scalars['String']['input'];
}>;


export type ConfirmOneOneTimeAccessTokenMutation = { __typename?: 'Mutation', users: { __typename?: 'UserMutation', oneTimeAccessToken: { __typename?: 'UserOneTimeAccessTokenMutation', success: boolean } } };

export type CreateOneOneTimeAccessTokenByEmailAddressMutationVariables = Exact<{
  emailAddress: Scalars['EmailAddress']['input'];
}>;


export type CreateOneOneTimeAccessTokenByEmailAddressMutation = { __typename?: 'Mutation', users: { __typename?: 'UserMutation', oneTimeAccessToken: { __typename?: 'UserOneTimeAccessTokenMutation', success: boolean } } };

export type ConfirmOnePhoneNumberUpdateMutationVariables = Exact<{
  secret: Scalars['String']['input'];
}>;


export type ConfirmOnePhoneNumberUpdateMutation = { __typename?: 'Mutation', users: { __typename?: 'UserMutation', phoneNumberUpdate: { __typename?: 'UserPhoneNumberUpdateMutation', success: boolean } } };

export type CreateOnePhoneNumberUpdateMutationVariables = Exact<{
  phoneNumber: Scalars['PhoneNumber']['input'];
  userId: Scalars['String']['input'];
}>;


export type CreateOnePhoneNumberUpdateMutation = { __typename?: 'Mutation', users: { __typename?: 'UserMutation', phoneNumberUpdate: { __typename?: 'UserPhoneNumberUpdateMutation', success: boolean } } };

export type UpdateUserProfilePictureMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  profilePicture?: InputMaybe<Scalars['Upload']['input']>;
}>;


export type UpdateUserProfilePictureMutation = { __typename?: 'Mutation', users: { __typename?: 'UserMutation', success: boolean } };

export type GetPageDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPageDataQuery = { __typename?: 'Query', users: { __typename?: 'UserQuery', signedInUser?: { __typename?: 'User', userId: string, firstName: string, profilePictureUrl?: string | null, isCook: boolean, isAdmin: boolean } | null } };

export type GetPrivacyPolicyPageDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPrivacyPolicyPageDataQuery = { __typename?: 'Query', users: { __typename?: 'UserQuery', signedInUser?: { __typename?: 'User', userId: string, firstName: string, profilePictureUrl?: string | null, isCook: boolean, isAdmin: boolean } | null }, publicPrivacyPolicyUpdates: { __typename?: 'PublicPrivacyPolicyUpdateQuery', findLatest?: { __typename?: 'PublicPrivacyPolicyUpdate', privacyPolicyUpdateId: string, englishText: string, germanText: string, createdAt: Date } | null } };

export type GetSignedInUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSignedInUserQuery = { __typename?: 'Query', users: { __typename?: 'UserQuery', signedInUser?: { __typename?: 'User', userId: string, firstName: string, profilePictureUrl?: string | null, isCook: boolean, isAdmin: boolean } | null } };

export type GetTermsAndConditionsPageDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTermsAndConditionsPageDataQuery = { __typename?: 'Query', users: { __typename?: 'UserQuery', signedInUser?: { __typename?: 'User', userId: string, firstName: string, profilePictureUrl?: string | null, isCook: boolean, isAdmin: boolean } | null }, publicTermsUpdates: { __typename?: 'PublicTermsUpdateQuery', findLatest?: { __typename?: 'PublicTermsUpdate', termsUpdateId: string, englishText: string, germanText: string, createdAt: Date } | null } };

export type CookGetStripeDashboardUrlQueryVariables = Exact<{
  cookId: Scalars['String']['input'];
}>;


export type CookGetStripeDashboardUrlQuery = { __typename?: 'Query', cooks: { __typename?: 'CookQuery', getStripeDashboardUrl?: string | null } };

export type CookGetStripeOnboardingUrlQueryVariables = Exact<{
  cookId: Scalars['String']['input'];
}>;


export type CookGetStripeOnboardingUrlQuery = { __typename?: 'Query', cooks: { __typename?: 'CookQuery', getStripeOnboardingUrl?: string | null } };

export type GetCookProfileMealsQueryVariables = Exact<{
  cookId: Scalars['String']['input'];
}>;


export type GetCookProfileMealsQuery = { __typename?: 'Query', cooks: { __typename?: 'CookQuery', meals: { __typename?: 'CookMealQuery', findMany: Array<{ __typename?: 'Meal', mealId: string, title: string, type: MealType, description: string, imageUrl?: string | null, createdAt: Date }> } } };

export type GetCookProfileMenuQueryVariables = Exact<{
  menuId: Scalars['String']['input'];
  cookId: Scalars['String']['input'];
}>;


export type GetCookProfileMenuQuery = { __typename?: 'Query', cooks: { __typename?: 'CookQuery', menus: { __typename?: 'CookMenuQuery', findOne?: { __typename?: 'Menu', menuId: string, isVisible: boolean, title: string, description: string, basePrice: number, basePriceCustomers: number, pricePerAdult: number, pricePerChild?: number | null, currencyCode: CurrencyCode, greetingFromKitchen?: string | null, preparationTime: number, createdAt: Date, kitchen?: { __typename?: 'Kitchen', kitchenId: string, title: string } | null, categories: Array<{ __typename?: 'Category', categoryId: string, title: string }>, courses: Array<{ __typename?: 'Course', courseId: string, index: number, title: string, mealOptions: Array<{ __typename?: 'MealOption', index: number, meal: { __typename?: 'Meal', mealId: string, title: string, description: string, imageUrl?: string | null, type: MealType, createdAt: Date } }> }> } | null } } };

export type GetCookProfilePersonalInformationQueryVariables = Exact<{
  cookId: Scalars['String']['input'];
}>;


export type GetCookProfilePersonalInformationQuery = { __typename?: 'Query', cooks: { __typename?: 'CookQuery', findOne?: { __typename?: 'Cook', cookId: string, isLocked: boolean, isVisible: boolean, biography: string, maximumParticipants?: number | null, maximumPrice?: number | null, maximumTravelDistance?: number | null, minimumParticipants?: number | null, minimumPrice?: number | null, rank: CookRank, travelExpenses: number, ratingAverage: number, ratingCount: number, hasStripePayoutMethodActivated: boolean, user: { __typename?: 'User', firstName: string, lastName: string, profilePictureUrl?: string | null, addresses: Array<{ __typename?: 'Address', addressId: string, title: string, country: string, city: string, postCode: string, street: string, houseNumber: string, createdAt: Date, location: { __typename?: 'Location', latitude: number, longitude: number } }> }, languages: Array<{ __typename?: 'Language', languageId: string, title: string }>, location: { __typename?: 'Location', latitude: number, longitude: number } } | null } };

export type GetMealsQueryVariables = Exact<{
  cookId: Scalars['String']['input'];
}>;


export type GetMealsQuery = { __typename?: 'Query', cooks: { __typename?: 'CookQuery', meals: { __typename?: 'CookMealQuery', findMany: Array<{ __typename?: 'Meal', mealId: string, cookId: string, title: string, type: MealType, description: string, imageUrl?: string | null, createdAt: Date }> } } };

export type GetCookProfileBookingsPageDataQueryVariables = Exact<{
  cookId: Scalars['String']['input'];
}>;


export type GetCookProfileBookingsPageDataQuery = { __typename?: 'Query', users: { __typename?: 'UserQuery', signedInUser?: { __typename?: 'User', userId: string, firstName: string, profilePictureUrl?: string | null, isCook: boolean, isAdmin: boolean } | null }, cooks: { __typename?: 'CookQuery', findOne?: { __typename?: 'Cook', hasStripePayoutMethodActivated: boolean } | null, bookingRequests: { __typename?: 'CookBookingRequestQuery', findMany?: Array<{ __typename?: 'BookingRequest', bookingRequestId: string, globalBookingRequestId?: string | null, adultParticipants: number, children: number, dateTime: Date, status: BookingRequestStatus, userAccepted?: boolean | null, cookAccepted?: boolean | null, kitchenId?: string | null, occasion: string, preparationTime: number, duration: number, createdAt: Date, price: { __typename?: 'Price', amount: number, currencyCode: CurrencyCode }, location: { __typename?: 'Location', latitude: number, longitude: number, text: string }, cook: { __typename?: 'PublicCook', cookId: string, rank: CookRank, user: { __typename?: 'PublicUser', firstName: string, profilePictureUrl?: string | null } }, configuredMenu?: { __typename?: 'ConfiguredMenu', title: string } | null }> | null } } };

export type GetCookProfileMealPageDataQueryVariables = Exact<{
  cookId: Scalars['String']['input'];
  mealId: Scalars['String']['input'];
}>;


export type GetCookProfileMealPageDataQuery = { __typename?: 'Query', users: { __typename?: 'UserQuery', signedInUser?: { __typename?: 'User', userId: string, firstName: string, profilePictureUrl?: string | null, isCook: boolean, isAdmin: boolean } | null }, cooks: { __typename?: 'CookQuery', meals: { __typename?: 'CookMealQuery', findOne?: { __typename?: 'Meal', mealId: string, title: string, description: string, imageUrl?: string | null, type: MealType, createdAt: Date } | null } } };

export type GetCookProfileMealsPageDataQueryVariables = Exact<{
  cookId: Scalars['String']['input'];
}>;


export type GetCookProfileMealsPageDataQuery = { __typename?: 'Query', users: { __typename?: 'UserQuery', signedInUser?: { __typename?: 'User', userId: string, firstName: string, profilePictureUrl?: string | null, isCook: boolean, isAdmin: boolean } | null }, cooks: { __typename?: 'CookQuery', meals: { __typename?: 'CookMealQuery', findMany: Array<{ __typename?: 'Meal', mealId: string, title: string, type: MealType, description: string, imageUrl?: string | null, createdAt: Date }> } } };

export type GetCookProfileMenuPageDataQueryVariables = Exact<{
  menuId: Scalars['String']['input'];
  cookId: Scalars['String']['input'];
}>;


export type GetCookProfileMenuPageDataQuery = { __typename?: 'Query', users: { __typename?: 'UserQuery', signedInUser?: { __typename?: 'User', userId: string, firstName: string, profilePictureUrl?: string | null, isCook: boolean, isAdmin: boolean, cook?: { __typename?: 'Cook', meals: Array<{ __typename?: 'Meal', mealId: string, cookId: string, title: string, type: MealType, description: string, imageUrl?: string | null, createdAt: Date }> } | null } | null }, cooks: { __typename?: 'CookQuery', menus: { __typename?: 'CookMenuQuery', findOne?: { __typename?: 'Menu', menuId: string, isVisible: boolean, title: string, description: string, basePrice: number, basePriceCustomers: number, pricePerAdult: number, pricePerChild?: number | null, currencyCode: CurrencyCode, greetingFromKitchen?: string | null, preparationTime: number, createdAt: Date, kitchen?: { __typename?: 'Kitchen', kitchenId: string, title: string } | null, categories: Array<{ __typename?: 'Category', categoryId: string, title: string }>, courses: Array<{ __typename?: 'Course', courseId: string, index: number, title: string, mealOptions: Array<{ __typename?: 'MealOption', index: number, meal: { __typename?: 'Meal', mealId: string, title: string, description: string, imageUrl?: string | null, type: MealType, createdAt: Date } }> }> } | null } }, categories: { __typename?: 'CategoryQuery', findAll: Array<{ __typename?: 'Category', categoryId: string, title: string }> }, kitchens: { __typename?: 'KitchenQuery', findAll: Array<{ __typename?: 'Kitchen', kitchenId: string, title: string }> } };

export type GetCookProfileMenusCreatePageDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCookProfileMenusCreatePageDataQuery = { __typename?: 'Query', users: { __typename?: 'UserQuery', signedInUser?: { __typename?: 'User', userId: string, firstName: string, profilePictureUrl?: string | null, isCook: boolean, isAdmin: boolean, cook?: { __typename?: 'Cook', meals: Array<{ __typename?: 'Meal', mealId: string, cookId: string, title: string, type: MealType, description: string, imageUrl?: string | null, createdAt: Date }> } | null } | null }, categories: { __typename?: 'CategoryQuery', findAll: Array<{ __typename?: 'Category', categoryId: string, title: string }> }, kitchens: { __typename?: 'KitchenQuery', findAll: Array<{ __typename?: 'Kitchen', kitchenId: string, title: string }> } };

export type GetCookProfileMenusPageDataQueryVariables = Exact<{
  cookId: Scalars['String']['input'];
}>;


export type GetCookProfileMenusPageDataQuery = { __typename?: 'Query', users: { __typename?: 'UserQuery', signedInUser?: { __typename?: 'User', userId: string, firstName: string, profilePictureUrl?: string | null, isCook: boolean, isAdmin: boolean } | null }, cooks: { __typename?: 'CookQuery', menus: { __typename?: 'CookMenuQuery', findMany: Array<{ __typename?: 'Menu', menuId: string, title: string, description: string, basePrice: number, basePriceCustomers: number, createdAt: Date, currencyCode: CurrencyCode, preparationTime: number, pricePerAdult: number, pricePerChild?: number | null, isVisible: boolean, imageUrls: Array<string>, categories: Array<{ __typename?: 'Category', categoryId: string, title: string }>, kitchen?: { __typename?: 'Kitchen', kitchenId: string, title: string } | null }> } } };

export type GetCookProfilePersonalInformationPageDataQueryVariables = Exact<{
  cookId: Scalars['String']['input'];
}>;


export type GetCookProfilePersonalInformationPageDataQuery = { __typename?: 'Query', users: { __typename?: 'UserQuery', signedInUser?: { __typename?: 'User', userId: string, firstName: string, profilePictureUrl?: string | null, isCook: boolean, isAdmin: boolean } | null }, languages: { __typename?: 'LanguageQuery', findAll: Array<{ __typename?: 'Language', languageId: string, title: string }> }, cooks: { __typename?: 'CookQuery', findOne?: { __typename?: 'Cook', cookId: string, isLocked: boolean, isVisible: boolean, biography: string, maximumParticipants?: number | null, maximumPrice?: number | null, maximumTravelDistance?: number | null, minimumParticipants?: number | null, minimumPrice?: number | null, rank: CookRank, travelExpenses: number, ratingAverage: number, ratingCount: number, hasStripePayoutMethodActivated: boolean, user: { __typename?: 'User', firstName: string, lastName: string, profilePictureUrl?: string | null, addresses: Array<{ __typename?: 'Address', addressId: string, title: string, country: string, city: string, postCode: string, street: string, houseNumber: string, createdAt: Date, location: { __typename?: 'Location', latitude: number, longitude: number } }> }, languages: Array<{ __typename?: 'Language', languageId: string, title: string }>, location: { __typename?: 'Location', latitude: number, longitude: number } } | null } };

export type GetCookSignUpPageDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCookSignUpPageDataQuery = { __typename?: 'Query', users: { __typename?: 'UserQuery', signedInUser?: { __typename?: 'User', userId: string, firstName: string, profilePictureUrl?: string | null, isCook: boolean, isAdmin: boolean } | null }, languages: { __typename?: 'LanguageQuery', findAll: Array<{ __typename?: 'Language', languageId: string, title: string }> } };

export type GetPublicCookPageDataQueryVariables = Exact<{
  cookId: Scalars['String']['input'];
}>;


export type GetPublicCookPageDataQuery = { __typename?: 'Query', users: { __typename?: 'UserQuery', signedInUser?: { __typename?: 'User', userId: string, firstName: string, profilePictureUrl?: string | null, isCook: boolean, isAdmin: boolean } | null }, publicCooks: { __typename?: 'PublicCookQuery', findOne?: { __typename?: 'PublicCook', cookId: string, rank: CookRank, biography: string, city: string, travelExpenses: number, maximumTravelDistance?: number | null, createdAt: Date, user: { __typename?: 'PublicUser', userId: string, firstName: string, profilePictureUrl?: string | null }, location: { __typename?: 'Location', latitude: number, longitude: number }, languages: Array<{ __typename?: 'Language', languageId: string, title: string }>, menus: Array<{ __typename?: 'PublicMenu', title: string, pricePerChild?: number | null, pricePerAdult: number, preparationTime: number, menuId: string, basePrice: number, basePriceCustomers: number, imageUrls: Array<string>, currencyCode: CurrencyCode, description: string, greetingFromKitchen?: string | null, createdAt: Date, kitchen?: { __typename?: 'Kitchen', kitchenId: string, title: string } | null, categories: Array<{ __typename?: 'Category', categoryId: string, title: string }> }> } | null }, categories: { __typename?: 'CategoryQuery', findAll: Array<{ __typename?: 'Category', categoryId: string, title: string }> }, kitchens: { __typename?: 'KitchenQuery', findAll: Array<{ __typename?: 'Kitchen', kitchenId: string, title: string }> }, allergies: { __typename?: 'AllergyQuery', findAll: Array<{ __typename?: 'Allergy', allergyId: string, title: string }> } };

export type GetPublicCooksPageDataQueryVariables = Exact<{
  request: FindManyPublicCooksRequest;
}>;


export type GetPublicCooksPageDataQuery = { __typename?: 'Query', users: { __typename?: 'UserQuery', signedInUser?: { __typename?: 'User', userId: string, firstName: string, profilePictureUrl?: string | null, isCook: boolean, isAdmin: boolean } | null }, publicCooks: { __typename?: 'PublicCookQuery', findMany: Array<{ __typename?: 'PublicCook', cookId: string, rank: CookRank, biography: string, city: string, travelExpenses: number, createdAt: Date, menuCount: number, user: { __typename?: 'PublicUser', userId: string, firstName: string, profilePictureUrl?: string | null }, location: { __typename?: 'Location', latitude: number, longitude: number } }> } };

export type GetGlobalBookingRequestPageDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGlobalBookingRequestPageDataQuery = { __typename?: 'Query', users: { __typename?: 'UserQuery', signedInUser?: { __typename?: 'User', userId: string, firstName: string, profilePictureUrl?: string | null, isCook: boolean, isAdmin: boolean } | null }, categories: { __typename?: 'CategoryQuery', findAll: Array<{ __typename?: 'Category', categoryId: string, title: string }> }, kitchens: { __typename?: 'KitchenQuery', findAll: Array<{ __typename?: 'Kitchen', kitchenId: string, title: string }> }, allergies: { __typename?: 'AllergyQuery', findAll: Array<{ __typename?: 'Allergy', allergyId: string, title: string }> } };

export type GetHomePageDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetHomePageDataQuery = { __typename?: 'Query', users: { __typename?: 'UserQuery', signedInUser?: { __typename?: 'User', userId: string, firstName: string, profilePictureUrl?: string | null, isCook: boolean, isAdmin: boolean } | null }, publicCooks: { __typename?: 'PublicCookQuery', findHeroes: Array<{ __typename?: 'PublicCook', cookId: string, rank: CookRank, biography: string, city: string, travelExpenses: number, createdAt: Date, user: { __typename?: 'PublicUser', userId: string, firstName: string, profilePictureUrl?: string | null }, location: { __typename?: 'Location', latitude: number, longitude: number } }> }, publicMenus: { __typename?: 'PublicMenuQuery', findHeroes: Array<{ __typename?: 'PublicMenu', menuId: string, title: string, description: string, imageUrls: Array<string>, basePrice: number, basePriceCustomers: number, pricePerAdult: number, pricePerChild?: number | null, currencyCode: CurrencyCode, kitchen?: { __typename?: 'Kitchen', kitchenId: string, title: string } | null, cook: { __typename?: 'PublicCook', cookId: string, rank: CookRank, user: { __typename?: 'PublicUser', firstName: string, profilePictureUrl?: string | null } }, categories: Array<{ __typename?: 'Category', categoryId: string, title: string }> }> } };

export type GetPublicMenuPageDataQueryVariables = Exact<{
  menuId: Scalars['String']['input'];
}>;


export type GetPublicMenuPageDataQuery = { __typename?: 'Query', stripePublishableKey?: string | null, users: { __typename?: 'UserQuery', signedInUser?: { __typename?: 'User', userId: string, firstName: string, profilePictureUrl?: string | null, isCook: boolean, isAdmin: boolean } | null }, publicMenus: { __typename?: 'PublicMenuQuery', findOne?: { __typename?: 'PublicMenu', menuId: string, title: string, description: string, greetingFromKitchen?: string | null, imageUrls: Array<string>, basePrice: number, basePriceCustomers: number, pricePerAdult: number, pricePerChild?: number | null, currencyCode: CurrencyCode, kitchen?: { __typename?: 'Kitchen', kitchenId: string, title: string } | null, cook: { __typename?: 'PublicCook', cookId: string, rank: CookRank, city: string, travelExpenses: number, maximumTravelDistance?: number | null, user: { __typename?: 'PublicUser', firstName: string, profilePictureUrl?: string | null }, location: { __typename?: 'Location', latitude: number, longitude: number } }, categories: Array<{ __typename?: 'Category', categoryId: string, title: string }>, courses: Array<{ __typename?: 'Course', index: number, courseId: string, title: string, mealOptions: Array<{ __typename?: 'MealOption', index: number, meal: { __typename?: 'Meal', mealId: string, title: string, description: string, type: MealType, imageUrl?: string | null } }> }> } | null }, allergies: { __typename?: 'AllergyQuery', findAll: Array<{ __typename?: 'Allergy', allergyId: string, title: string }> } };

export type GetPublicMenusPageDataQueryVariables = Exact<{
  request: FindManyPublicMenusRequest;
}>;


export type GetPublicMenusPageDataQuery = { __typename?: 'Query', users: { __typename?: 'UserQuery', signedInUser?: { __typename?: 'User', userId: string, firstName: string, profilePictureUrl?: string | null, isCook: boolean, isAdmin: boolean } | null }, publicMenus: { __typename?: 'PublicMenuQuery', findMany: Array<{ __typename?: 'PublicMenu', menuId: string, title: string, description: string, imageUrls: Array<string>, basePrice: number, basePriceCustomers: number, pricePerAdult: number, pricePerChild?: number | null, currencyCode: CurrencyCode, courseCount: number, kitchen?: { __typename?: 'Kitchen', kitchenId: string, title: string } | null, cook: { __typename?: 'PublicCook', cookId: string, rank: CookRank, user: { __typename?: 'PublicUser', firstName: string, profilePictureUrl?: string | null } }, categories: Array<{ __typename?: 'Category', categoryId: string, title: string }> }> } };

export type UserBookingRequestConfirmPaymentSetupMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  bookingRequestId: Scalars['String']['input'];
}>;


export type UserBookingRequestConfirmPaymentSetupMutation = { __typename?: 'Mutation', users: { __typename?: 'UserMutation', bookingRequests: { __typename?: 'UserBookingRequestMutation', success: boolean } } };

export type GetProfilePersonalInformationQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProfilePersonalInformationQuery = { __typename?: 'Query', users: { __typename?: 'UserQuery', me?: { __typename?: 'User', userId: string, firstName: string, lastName: string, profilePictureUrl?: string | null, birthDate?: string | null, gender: Gender, acceptedTerms: Date, acceptedPrivacyPolicy: Date, emailAddress?: string | null, phoneNumber?: string | null, createdAt: Date, isCook: boolean, isAdmin: boolean, addresses: Array<{ __typename?: 'Address', addressId: string, title: string, country: string, city: string, postCode: string, street: string, houseNumber: string, createdAt: Date, location: { __typename?: 'Location', latitude: number, longitude: number } }>, emailAddressUpdate?: { __typename?: 'EmailAddressUpdate', emailAddress: string, createdAt: Date } | null, phoneNumberUpdate?: { __typename?: 'PhoneNumberUpdate', phoneNumber: string, createdAt: Date } | null } | null } };

export type GetProfileBookingsPageDataQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetProfileBookingsPageDataQuery = { __typename?: 'Query', users: { __typename?: 'UserQuery', signedInUser?: { __typename?: 'User', userId: string, firstName: string, profilePictureUrl?: string | null, isCook: boolean, isAdmin: boolean } | null, bookingRequests: { __typename?: 'UserBookingRequestQuery', findMany?: Array<{ __typename?: 'BookingRequest', bookingRequestId: string, globalBookingRequestId?: string | null, adultParticipants: number, children: number, dateTime: Date, status: BookingRequestStatus, userAccepted?: boolean | null, cookAccepted?: boolean | null, kitchenId?: string | null, occasion: string, preparationTime: number, duration: number, createdAt: Date, price: { __typename?: 'Price', amount: number, currencyCode: CurrencyCode }, location: { __typename?: 'Location', latitude: number, longitude: number, text: string }, cook: { __typename?: 'PublicCook', cookId: string, rank: CookRank, user: { __typename?: 'PublicUser', firstName: string, profilePictureUrl?: string | null } }, configuredMenu?: { __typename?: 'ConfiguredMenu', title: string } | null }> | null }, globalBookingRequests: { __typename?: 'UserGlobalBookingRequestQuery', findMany?: Array<{ __typename?: 'GlobalBookingRequest', globalBookingRequestId: string, children: number, adultParticipants: number, occasion: string, message: string, dateTime: Date, duration?: number | null, createdAt: Date, priceClass: { __typename?: 'GlobalBookingRequestPriceClass', type: GlobalBookingRequestPriceClassType, min: number, max: number, currencyCode: CurrencyCode }, location: { __typename?: 'Location', latitude: number, longitude: number, text: string } }> | null } } };

export type GetProfileFavoriteCooksPageDataQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetProfileFavoriteCooksPageDataQuery = { __typename?: 'Query', users: { __typename?: 'UserQuery', signedInUser?: { __typename?: 'User', userId: string, firstName: string, profilePictureUrl?: string | null, isCook: boolean, isAdmin: boolean } | null, followings: { __typename?: 'UserFollowingQuery', findAll: Array<{ __typename?: 'Following', cookId: string, cook: { __typename?: 'PublicCook', rank: CookRank, city: string, user: { __typename?: 'PublicUser', firstName: string, profilePictureUrl?: string | null }, location: { __typename?: 'Location', text: string, longitude: number, latitude: number } } }> } } };

export type GetProfilePersonalInformationPageDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProfilePersonalInformationPageDataQuery = { __typename?: 'Query', users: { __typename?: 'UserQuery', signedInUser?: { __typename?: 'User', userId: string, firstName: string, profilePictureUrl?: string | null, isCook: boolean, isAdmin: boolean } | null, me?: { __typename?: 'User', userId: string, firstName: string, lastName: string, profilePictureUrl?: string | null, birthDate?: string | null, gender: Gender, acceptedTerms: Date, acceptedPrivacyPolicy: Date, emailAddress?: string | null, phoneNumber?: string | null, createdAt: Date, isCook: boolean, isAdmin: boolean, addresses: Array<{ __typename?: 'Address', addressId: string, title: string, country: string, city: string, postCode: string, street: string, houseNumber: string, createdAt: Date, location: { __typename?: 'Location', latitude: number, longitude: number } }>, emailAddressUpdate?: { __typename?: 'EmailAddressUpdate', emailAddress: string, createdAt: Date } | null, phoneNumberUpdate?: { __typename?: 'PhoneNumberUpdate', phoneNumber: string, createdAt: Date } | null } | null } };

export const AllergyOptionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllergyOption"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Allergy"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allergyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]} as unknown as DocumentNode<AllergyOptionFragment, unknown>;
export const CategoryOptionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryOption"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]} as unknown as DocumentNode<CategoryOptionFragment, unknown>;
export const KitchenOptionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"KitchenOption"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Kitchen"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kitchenId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]} as unknown as DocumentNode<KitchenOptionFragment, unknown>;
export const LanguageOptionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LanguageOption"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Language"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]} as unknown as DocumentNode<LanguageOptionFragment, unknown>;
export const SignedInUserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignedInUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isCook"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<SignedInUserFragment, unknown>;
export const AssignOneSessionByEmailAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignOneSessionByEmailAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"request"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOneSessionByEmailAddressRequest"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"assignOneByEmailAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"request"},"value":{"kind":"Variable","name":{"kind":"Name","value":"request"}}}]}]}}]}}]} as unknown as DocumentNode<AssignOneSessionByEmailAddressMutation, AssignOneSessionByEmailAddressMutationVariables>;
export const CreateOneCookDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOneCook"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"request"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOneCookRequest"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"createOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}},{"kind":"Argument","name":{"kind":"Name","value":"request"},"value":{"kind":"Variable","name":{"kind":"Name","value":"request"}}}]}]}}]}}]} as unknown as DocumentNode<CreateOneCookMutation, CreateOneCookMutationVariables>;
export const CreateOneUserByEmailAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOneUserByEmailAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"request"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOneUserByEmailAddressRequest"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"createOneByEmailAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"request"},"value":{"kind":"Variable","name":{"kind":"Name","value":"request"}}},{"kind":"Argument","name":{"kind":"Name","value":"profilePicture"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}}}]}]}}]}}]} as unknown as DocumentNode<CreateOneUserByEmailAddressMutation, CreateOneUserByEmailAddressMutationVariables>;
export const ExpireCurrentSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ExpireCurrentSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"expireCurrent"}}]}}]}}]}}]} as unknown as DocumentNode<ExpireCurrentSessionMutation, ExpireCurrentSessionMutationVariables>;
export const CreateOneUserBookingRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOneUserBookingRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"request"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBookingRequestRequest"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"request"},"value":{"kind":"Variable","name":{"kind":"Name","value":"request"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"clientSecret"}},{"kind":"Field","name":{"kind":"Name","value":"bookingRequestId"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateOneUserBookingRequestMutation, CreateOneUserBookingRequestMutationVariables>;
export const CreateOneUserGlobalBookingRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOneUserGlobalBookingRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"request"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOneGlobalBookingRequestRequest"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"globalBookingRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"createOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"request"},"value":{"kind":"Variable","name":{"kind":"Name","value":"request"}}}]}]}}]}}]}}]} as unknown as DocumentNode<CreateOneUserGlobalBookingRequestMutation, CreateOneUserGlobalBookingRequestMutationVariables>;
export const UpdateCookBiographyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookBiography"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"biography"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updateBiography"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}},{"kind":"Argument","name":{"kind":"Name","value":"biography"},"value":{"kind":"Variable","name":{"kind":"Name","value":"biography"}}}]}]}}]}}]} as unknown as DocumentNode<UpdateCookBiographyMutation, UpdateCookBiographyMutationVariables>;
export const UpdateCookIsVisibleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookIsVisible"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isVisible"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updateIsVisible"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}},{"kind":"Argument","name":{"kind":"Name","value":"isVisible"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isVisible"}}}]}]}}]}}]} as unknown as DocumentNode<UpdateCookIsVisibleMutation, UpdateCookIsVisibleMutationVariables>;
export const UpdateCookLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookLocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"location"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LocationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updateLocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}},{"kind":"Argument","name":{"kind":"Name","value":"location"},"value":{"kind":"Variable","name":{"kind":"Name","value":"location"}}}]}]}}]}}]} as unknown as DocumentNode<UpdateCookLocationMutation, UpdateCookLocationMutationVariables>;
export const UpdateCookMaximumParticipantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookMaximumParticipants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"maximumParticipants"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UnsignedInt"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updateMaximumParticipants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}},{"kind":"Argument","name":{"kind":"Name","value":"maximumParticipants"},"value":{"kind":"Variable","name":{"kind":"Name","value":"maximumParticipants"}}}]}]}}]}}]} as unknown as DocumentNode<UpdateCookMaximumParticipantsMutation, UpdateCookMaximumParticipantsMutationVariables>;
export const UpdateCookMaximumPriceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookMaximumPrice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updateMaximumPrice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}]}]}}]}}]} as unknown as DocumentNode<UpdateCookMaximumPriceMutation, UpdateCookMaximumPriceMutationVariables>;
export const UpdateCookMaximumTravelDistanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookMaximumTravelDistance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"maximumTravelDistance"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UnsignedInt"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updateMaximumTravelDistance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}},{"kind":"Argument","name":{"kind":"Name","value":"maximumTravelDistance"},"value":{"kind":"Variable","name":{"kind":"Name","value":"maximumTravelDistance"}}}]}]}}]}}]} as unknown as DocumentNode<UpdateCookMaximumTravelDistanceMutation, UpdateCookMaximumTravelDistanceMutationVariables>;
export const UpdateCookMinimumParticipantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookMinimumParticipants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updateMinimumParticipants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}]}]}}]}}]} as unknown as DocumentNode<UpdateCookMinimumParticipantsMutation, UpdateCookMinimumParticipantsMutationVariables>;
export const UpdateCookMinimumPriceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookMinimumPrice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updateMinimumPrice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}]}]}}]}}]} as unknown as DocumentNode<UpdateCookMinimumPriceMutation, UpdateCookMinimumPriceMutationVariables>;
export const UpdateCookRankDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookRank"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rank"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CookRank"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updateRank"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}},{"kind":"Argument","name":{"kind":"Name","value":"rank"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rank"}}}]}]}}]}}]} as unknown as DocumentNode<UpdateCookRankMutation, UpdateCookRankMutationVariables>;
export const UpdateCookTravelExpensesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookTravelExpenses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"travelExpenses"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UnsignedInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updateTravelExpenses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}},{"kind":"Argument","name":{"kind":"Name","value":"travelExpenses"},"value":{"kind":"Variable","name":{"kind":"Name","value":"travelExpenses"}}}]}]}}]}}]} as unknown as DocumentNode<UpdateCookTravelExpensesMutation, UpdateCookTravelExpensesMutationVariables>;
export const CreateOneUserAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOneUserAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOneAddressRequest"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addresses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"createOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}}]}]}}]}}]}}]} as unknown as DocumentNode<CreateOneUserAddressMutation, CreateOneUserAddressMutationVariables>;
export const DeleteOneUserAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteOneUserAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"addressId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addresses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"deleteOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"addressId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"addressId"}}}]}]}}]}}]}}]} as unknown as DocumentNode<DeleteOneUserAddressMutation, DeleteOneUserAddressMutationVariables>;
export const AddOneCookLanguageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddOneCookLanguage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"addOneLanguage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}},{"kind":"Argument","name":{"kind":"Name","value":"languageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languageId"}}}]}]}}]}}]} as unknown as DocumentNode<AddOneCookLanguageMutation, AddOneCookLanguageMutationVariables>;
export const RemoveOneCookLanguageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveOneCookLanguage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"removeOneLanguage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}},{"kind":"Argument","name":{"kind":"Name","value":"languageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languageId"}}}]}]}}]}}]} as unknown as DocumentNode<RemoveOneCookLanguageMutation, RemoveOneCookLanguageMutationVariables>;
export const ConfirmOneEmailAddressUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConfirmOneEmailAddressUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"secret"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailAddressUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"StringValue","value":"","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"confirm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"secret"},"value":{"kind":"Variable","name":{"kind":"Name","value":"secret"}}}]}]}}]}}]}}]} as unknown as DocumentNode<ConfirmOneEmailAddressUpdateMutation, ConfirmOneEmailAddressUpdateMutationVariables>;
export const CreateOneEmailAddressUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOneEmailAddressUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"emailAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailAddress"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailAddressUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"createOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"emailAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"emailAddress"}}}]}]}}]}}]}}]} as unknown as DocumentNode<CreateOneEmailAddressUpdateMutation, CreateOneEmailAddressUpdateMutationVariables>;
export const CreateMealDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMeal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meal"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOneMealRequest"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"createOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"meal"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meal"}}},{"kind":"Argument","name":{"kind":"Name","value":"image"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image"}}}]}]}}]}}]}}]} as unknown as DocumentNode<CreateMealMutation, CreateMealMutationVariables>;
export const DeleteOneCookMealDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteOneCookMeal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mealId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"deleteOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mealId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mealId"}}}]}]}}]}}]}}]} as unknown as DocumentNode<DeleteOneCookMealMutation, DeleteOneCookMealMutationVariables>;
export const UpdateCookMealDescriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookMealDescription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mealId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updateDescription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mealId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mealId"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}}]}]}}]}}]}}]} as unknown as DocumentNode<UpdateCookMealDescriptionMutation, UpdateCookMealDescriptionMutationVariables>;
export const UpdateCookMealImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookMealImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mealId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updateImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mealId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mealId"}}},{"kind":"Argument","name":{"kind":"Name","value":"image"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image"}}}]}]}}]}}]}}]} as unknown as DocumentNode<UpdateCookMealImageMutation, UpdateCookMealImageMutationVariables>;
export const UpdateCookMealTitleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookMealTitle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mealId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updateTitle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mealId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mealId"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}}]}]}}]}}]}}]} as unknown as DocumentNode<UpdateCookMealTitleMutation, UpdateCookMealTitleMutationVariables>;
export const UpdateCookMealTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookMealType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mealId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MealType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updateType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mealId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mealId"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}]}]}}]}}]}}]} as unknown as DocumentNode<UpdateCookMealTypeMutation, UpdateCookMealTypeMutationVariables>;
export const CreateManyCookMenuCourseMealOptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateManyCookMenuCourseMealOptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mealOptions"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOneMealOptionRequest"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mealOptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"createMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mealOptions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mealOptions"}}}]}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateManyCookMenuCourseMealOptionsMutation, CreateManyCookMenuCourseMealOptionsMutationVariables>;
export const CreateOneCookMenuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOneCookMenu"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menu"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOneMenuRequest"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"createOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menu"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menu"}}}]}]}}]}}]}}]} as unknown as DocumentNode<CreateOneCookMenuMutation, CreateOneCookMenuMutationVariables>;
export const CreateOneCookMenuCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOneCookMenuCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"request"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOneCourseRequest"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"createOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"request"},"value":{"kind":"Variable","name":{"kind":"Name","value":"request"}}}]}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateOneCookMenuCourseMutation, CreateOneCookMenuCourseMutationVariables>;
export const DeleteOneCookMenuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteOneCookMenu"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"deleteOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}}]}]}}]}}]}}]} as unknown as DocumentNode<DeleteOneCookMenuMutation, DeleteOneCookMenuMutationVariables>;
export const DeleteOneCookMenuCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteOneCookMenuCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"deleteOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}]}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteOneCookMenuCourseMutation, DeleteOneCookMenuCourseMutationVariables>;
export const DeleteOneCookMenuCourseMealOptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteOneCookMenuCourseMealOption"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mealId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mealOptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mealId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mealId"}}}]}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteOneCookMenuCourseMealOptionMutation, DeleteOneCookMenuCourseMealOptionMutationVariables>;
export const UpdateCookMenuBasePriceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookMenuBasePrice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"basePrice"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UnsignedInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updateBasePrice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}},{"kind":"Argument","name":{"kind":"Name","value":"basePrice"},"value":{"kind":"Variable","name":{"kind":"Name","value":"basePrice"}}}]}]}}]}}]}}]} as unknown as DocumentNode<UpdateCookMenuBasePriceMutation, UpdateCookMenuBasePriceMutationVariables>;
export const UpdateCookMenuBasePriceCustomersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookMenuBasePriceCustomers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"basePriceCustomers"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UnsignedInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updateBasePriceCustomers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}},{"kind":"Argument","name":{"kind":"Name","value":"basePriceCustomers"},"value":{"kind":"Variable","name":{"kind":"Name","value":"basePriceCustomers"}}}]}]}}]}}]}}]} as unknown as DocumentNode<UpdateCookMenuBasePriceCustomersMutation, UpdateCookMenuBasePriceCustomersMutationVariables>;
export const UpdateCookMenuCourseTitleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookMenuCourseTitle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTitle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}}]}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateCookMenuCourseTitleMutation, UpdateCookMenuCourseTitleMutationVariables>;
export const UpdateCookMenuCurrencyCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookMenuCurrencyCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currencyCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CurrencyCode"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updateCurrencyCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}},{"kind":"Argument","name":{"kind":"Name","value":"currencyCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currencyCode"}}}]}]}}]}}]}}]} as unknown as DocumentNode<UpdateCookMenuCurrencyCodeMutation, UpdateCookMenuCurrencyCodeMutationVariables>;
export const UpdateCookMenuDescriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookMenuDescription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updateDescription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}}]}]}}]}}]}}]} as unknown as DocumentNode<UpdateCookMenuDescriptionMutation, UpdateCookMenuDescriptionMutationVariables>;
export const UpdateCookMenuGreetingFromKitchenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookMenuGreetingFromKitchen"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"greetingFromKitchen"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updateGreetingFromKitchen"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}},{"kind":"Argument","name":{"kind":"Name","value":"greetingFromKitchen"},"value":{"kind":"Variable","name":{"kind":"Name","value":"greetingFromKitchen"}}}]}]}}]}}]}}]} as unknown as DocumentNode<UpdateCookMenuGreetingFromKitchenMutation, UpdateCookMenuGreetingFromKitchenMutationVariables>;
export const UpdateCookMenuIsVisibleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookMenuIsVisible"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isVisible"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updateIsVisible"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}},{"kind":"Argument","name":{"kind":"Name","value":"isVisible"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isVisible"}}}]}]}}]}}]}}]} as unknown as DocumentNode<UpdateCookMenuIsVisibleMutation, UpdateCookMenuIsVisibleMutationVariables>;
export const UpdateCookMenuKitchenIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookMenuKitchenId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"kitchenId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updateKitchenId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}},{"kind":"Argument","name":{"kind":"Name","value":"kitchenId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"kitchenId"}}}]}]}}]}}]}}]} as unknown as DocumentNode<UpdateCookMenuKitchenIdMutation, UpdateCookMenuKitchenIdMutationVariables>;
export const UpdateCookMenuPreparationTimeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookMenuPreparationTime"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"preparationTime"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UnsignedInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updatePreparationTime"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}},{"kind":"Argument","name":{"kind":"Name","value":"preparationTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"preparationTime"}}}]}]}}]}}]}}]} as unknown as DocumentNode<UpdateCookMenuPreparationTimeMutation, UpdateCookMenuPreparationTimeMutationVariables>;
export const UpdateCookMenuPricePerAdultDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookMenuPricePerAdult"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pricePerAdult"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UnsignedInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updatePricePerAdult"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}},{"kind":"Argument","name":{"kind":"Name","value":"pricePerAdult"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pricePerAdult"}}}]}]}}]}}]}}]} as unknown as DocumentNode<UpdateCookMenuPricePerAdultMutation, UpdateCookMenuPricePerAdultMutationVariables>;
export const UpdateCookMenuPricePerChildDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookMenuPricePerChild"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pricePerChild"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UnsignedInt"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updatePricePerChild"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}},{"kind":"Argument","name":{"kind":"Name","value":"pricePerChild"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pricePerChild"}}}]}]}}]}}]}}]} as unknown as DocumentNode<UpdateCookMenuPricePerChildMutation, UpdateCookMenuPricePerChildMutationVariables>;
export const UpdateCookMenuTitleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCookMenuTitle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updateTitle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}}]}]}}]}}]}}]} as unknown as DocumentNode<UpdateCookMenuTitleMutation, UpdateCookMenuTitleMutationVariables>;
export const ConfirmOneOneTimeAccessTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConfirmOneOneTimeAccessToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"secret"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"oneTimeAccessToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"StringValue","value":"","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"confirm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"secret"},"value":{"kind":"Variable","name":{"kind":"Name","value":"secret"}}}]}]}}]}}]}}]} as unknown as DocumentNode<ConfirmOneOneTimeAccessTokenMutation, ConfirmOneOneTimeAccessTokenMutationVariables>;
export const CreateOneOneTimeAccessTokenByEmailAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOneOneTimeAccessTokenByEmailAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"emailAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailAddress"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"oneTimeAccessToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"StringValue","value":"","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"createOneForEmailAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"emailAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"emailAddress"}}}]}]}}]}}]}}]} as unknown as DocumentNode<CreateOneOneTimeAccessTokenByEmailAddressMutation, CreateOneOneTimeAccessTokenByEmailAddressMutationVariables>;
export const ConfirmOnePhoneNumberUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConfirmOnePhoneNumberUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"secret"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneNumberUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"StringValue","value":"","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"confirm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"secret"},"value":{"kind":"Variable","name":{"kind":"Name","value":"secret"}}}]}]}}]}}]}}]} as unknown as DocumentNode<ConfirmOnePhoneNumberUpdateMutation, ConfirmOnePhoneNumberUpdateMutationVariables>;
export const CreateOnePhoneNumberUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOnePhoneNumberUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phoneNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PhoneNumber"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneNumberUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"createOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"phoneNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phoneNumber"}}}]}]}}]}}]}}]} as unknown as DocumentNode<CreateOnePhoneNumberUpdateMutation, CreateOnePhoneNumberUpdateMutationVariables>;
export const UpdateUserProfilePictureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserProfilePicture"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"updateProfilePicture"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"profilePicture"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profilePicture"}}}]}]}}]}}]} as unknown as DocumentNode<UpdateUserProfilePictureMutation, UpdateUserProfilePictureMutationVariables>;
export const GetPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPageData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"signedInUser"},"name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignedInUser"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignedInUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isCook"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<GetPageDataQuery, GetPageDataQueryVariables>;
export const GetPrivacyPolicyPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPrivacyPolicyPageData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"signedInUser"},"name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignedInUser"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"publicPrivacyPolicyUpdates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findLatest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"privacyPolicyUpdateId"}},{"kind":"Field","name":{"kind":"Name","value":"englishText"}},{"kind":"Field","name":{"kind":"Name","value":"germanText"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignedInUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isCook"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<GetPrivacyPolicyPageDataQuery, GetPrivacyPolicyPageDataQueryVariables>;
export const GetSignedInUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSignedInUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"signedInUser"},"name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignedInUser"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignedInUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isCook"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<GetSignedInUserQuery, GetSignedInUserQueryVariables>;
export const GetTermsAndConditionsPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTermsAndConditionsPageData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"signedInUser"},"name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignedInUser"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"publicTermsUpdates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findLatest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"termsUpdateId"}},{"kind":"Field","name":{"kind":"Name","value":"englishText"}},{"kind":"Field","name":{"kind":"Name","value":"germanText"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignedInUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isCook"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<GetTermsAndConditionsPageDataQuery, GetTermsAndConditionsPageDataQueryVariables>;
export const CookGetStripeDashboardUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CookGetStripeDashboardUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getStripeDashboardUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}]}]}}]}}]} as unknown as DocumentNode<CookGetStripeDashboardUrlQuery, CookGetStripeDashboardUrlQueryVariables>;
export const CookGetStripeOnboardingUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CookGetStripeOnboardingUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getStripeOnboardingUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}]}]}}]}}]} as unknown as DocumentNode<CookGetStripeOnboardingUrlQuery, CookGetStripeOnboardingUrlQueryVariables>;
export const GetCookProfileMealsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCookProfileMeals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findMany"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mealId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCookProfileMealsQuery, GetCookProfileMealsQueryVariables>;
export const GetCookProfileMenuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCookProfileMenu"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menuId"}},{"kind":"Field","name":{"kind":"Name","value":"isVisible"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"basePrice"}},{"kind":"Field","name":{"kind":"Name","value":"basePriceCustomers"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerAdult"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerChild"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"greetingFromKitchen"}},{"kind":"Field","name":{"kind":"Name","value":"preparationTime"}},{"kind":"Field","name":{"kind":"Name","value":"kitchen"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kitchenId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"courses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courseId"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"mealOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"meal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mealId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCookProfileMenuQuery, GetCookProfileMenuQueryVariables>;
export const GetCookProfilePersonalInformationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCookProfilePersonalInformation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cookId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addressId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"postCode"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"houseNumber"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"languages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}},{"kind":"Field","name":{"kind":"Name","value":"isVisible"}},{"kind":"Field","name":{"kind":"Name","value":"biography"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"maximumParticipants"}},{"kind":"Field","name":{"kind":"Name","value":"maximumPrice"}},{"kind":"Field","name":{"kind":"Name","value":"maximumTravelDistance"}},{"kind":"Field","name":{"kind":"Name","value":"minimumParticipants"}},{"kind":"Field","name":{"kind":"Name","value":"minimumPrice"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"travelExpenses"}},{"kind":"Field","name":{"kind":"Name","value":"ratingAverage"}},{"kind":"Field","name":{"kind":"Name","value":"ratingCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasStripePayoutMethodActivated"}}]}}]}}]}}]} as unknown as DocumentNode<GetCookProfilePersonalInformationQuery, GetCookProfilePersonalInformationQueryVariables>;
export const GetMealsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findMany"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mealId"}},{"kind":"Field","name":{"kind":"Name","value":"cookId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMealsQuery, GetMealsQueryVariables>;
export const GetCookProfileBookingsPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCookProfileBookingsPageData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"signedInUser"},"name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignedInUser"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasStripePayoutMethodActivated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bookingRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findMany"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingRequestId"}},{"kind":"Field","name":{"kind":"Name","value":"globalBookingRequestId"}},{"kind":"Field","name":{"kind":"Name","value":"adultParticipants"}},{"kind":"Field","name":{"kind":"Name","value":"children"}},{"kind":"Field","name":{"kind":"Name","value":"dateTime"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"userAccepted"}},{"kind":"Field","name":{"kind":"Name","value":"cookAccepted"}},{"kind":"Field","name":{"kind":"Name","value":"kitchenId"}},{"kind":"Field","name":{"kind":"Name","value":"occasion"}},{"kind":"Field","name":{"kind":"Name","value":"preparationTime"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"cook"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cookId"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"configuredMenu"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignedInUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isCook"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<GetCookProfileBookingsPageDataQuery, GetCookProfileBookingsPageDataQueryVariables>;
export const GetCookProfileMealPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCookProfileMealPageData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mealId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"signedInUser"},"name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignedInUser"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mealId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mealId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mealId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignedInUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isCook"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<GetCookProfileMealPageDataQuery, GetCookProfileMealPageDataQueryVariables>;
export const GetCookProfileMealsPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCookProfileMealsPageData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"signedInUser"},"name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignedInUser"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findMany"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mealId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignedInUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isCook"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<GetCookProfileMealsPageDataQuery, GetCookProfileMealsPageDataQueryVariables>;
export const GetCookProfileMenuPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCookProfileMenuPageData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"signedInUser"},"name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignedInUser"}},{"kind":"Field","name":{"kind":"Name","value":"cook"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mealId"}},{"kind":"Field","name":{"kind":"Name","value":"cookId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menuId"}},{"kind":"Field","name":{"kind":"Name","value":"isVisible"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"basePrice"}},{"kind":"Field","name":{"kind":"Name","value":"basePriceCustomers"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerAdult"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerChild"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"greetingFromKitchen"}},{"kind":"Field","name":{"kind":"Name","value":"preparationTime"}},{"kind":"Field","name":{"kind":"Name","value":"kitchen"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kitchenId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"courses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courseId"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"mealOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"meal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mealId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findAll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"kitchens"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findAll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kitchenId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignedInUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isCook"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<GetCookProfileMenuPageDataQuery, GetCookProfileMenuPageDataQueryVariables>;
export const GetCookProfileMenusCreatePageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCookProfileMenusCreatePageData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"signedInUser"},"name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignedInUser"}},{"kind":"Field","name":{"kind":"Name","value":"cook"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mealId"}},{"kind":"Field","name":{"kind":"Name","value":"cookId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findAll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"kitchens"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findAll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kitchenId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignedInUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isCook"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<GetCookProfileMenusCreatePageDataQuery, GetCookProfileMenusCreatePageDataQueryVariables>;
export const GetCookProfileMenusPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCookProfileMenusPageData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"signedInUser"},"name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignedInUser"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findMany"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menuId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"basePrice"}},{"kind":"Field","name":{"kind":"Name","value":"basePriceCustomers"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"preparationTime"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerAdult"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerChild"}},{"kind":"Field","name":{"kind":"Name","value":"isVisible"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"kitchen"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kitchenId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageUrls"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignedInUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isCook"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<GetCookProfileMenusPageDataQuery, GetCookProfileMenusPageDataQueryVariables>;
export const GetCookProfilePersonalInformationPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCookProfilePersonalInformationPageData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"signedInUser"},"name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignedInUser"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"languages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findAll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cookId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addressId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"postCode"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"houseNumber"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"languages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}},{"kind":"Field","name":{"kind":"Name","value":"isVisible"}},{"kind":"Field","name":{"kind":"Name","value":"biography"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"maximumParticipants"}},{"kind":"Field","name":{"kind":"Name","value":"maximumPrice"}},{"kind":"Field","name":{"kind":"Name","value":"maximumTravelDistance"}},{"kind":"Field","name":{"kind":"Name","value":"minimumParticipants"}},{"kind":"Field","name":{"kind":"Name","value":"minimumPrice"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"travelExpenses"}},{"kind":"Field","name":{"kind":"Name","value":"ratingAverage"}},{"kind":"Field","name":{"kind":"Name","value":"ratingCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasStripePayoutMethodActivated"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignedInUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isCook"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<GetCookProfilePersonalInformationPageDataQuery, GetCookProfilePersonalInformationPageDataQueryVariables>;
export const GetCookSignUpPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCookSignUpPageData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"signedInUser"},"name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignedInUser"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"languages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findAll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignedInUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isCook"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<GetCookSignUpPageDataQuery, GetCookSignUpPageDataQueryVariables>;
export const GetPublicCookPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPublicCookPageData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"signedInUser"},"name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignedInUser"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"publicCooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cookId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cookId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cookId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"biography"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"travelExpenses"}},{"kind":"Field","name":{"kind":"Name","value":"maximumTravelDistance"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"languages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"menus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerChild"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerAdult"}},{"kind":"Field","name":{"kind":"Name","value":"preparationTime"}},{"kind":"Field","name":{"kind":"Name","value":"menuId"}},{"kind":"Field","name":{"kind":"Name","value":"kitchen"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kitchenId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"basePrice"}},{"kind":"Field","name":{"kind":"Name","value":"basePriceCustomers"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageUrls"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"greetingFromKitchen"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findAll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CategoryOption"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"kitchens"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findAll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"KitchenOption"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"allergies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findAll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AllergyOption"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignedInUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isCook"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CategoryOption"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Category"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"KitchenOption"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Kitchen"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kitchenId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllergyOption"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Allergy"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allergyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]} as unknown as DocumentNode<GetPublicCookPageDataQuery, GetPublicCookPageDataQueryVariables>;
export const GetPublicCooksPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPublicCooksPageData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"request"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FindManyPublicCooksRequest"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"signedInUser"},"name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignedInUser"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"publicCooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"request"},"value":{"kind":"Variable","name":{"kind":"Name","value":"request"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cookId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"biography"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"travelExpenses"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"menuCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignedInUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isCook"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<GetPublicCooksPageDataQuery, GetPublicCooksPageDataQueryVariables>;
export const GetGlobalBookingRequestPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGlobalBookingRequestPageData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"signedInUser"},"name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignedInUser"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findAll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"kitchens"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findAll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kitchenId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"allergies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findAll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allergyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignedInUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isCook"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<GetGlobalBookingRequestPageDataQuery, GetGlobalBookingRequestPageDataQueryVariables>;
export const GetHomePageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetHomePageData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"signedInUser"},"name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignedInUser"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"publicCooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findHeroes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cookId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"biography"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"travelExpenses"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"publicMenus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findHeroes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menuId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"kitchen"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kitchenId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cook"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cookId"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageUrls"}},{"kind":"Field","name":{"kind":"Name","value":"basePrice"}},{"kind":"Field","name":{"kind":"Name","value":"basePriceCustomers"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerAdult"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerChild"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignedInUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isCook"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<GetHomePageDataQuery, GetHomePageDataQueryVariables>;
export const GetPublicMenuPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPublicMenuPageData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"signedInUser"},"name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignedInUser"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"publicMenus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findOne"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"menuId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"menuId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menuId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"greetingFromKitchen"}},{"kind":"Field","name":{"kind":"Name","value":"kitchen"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kitchenId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cook"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cookId"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"travelExpenses"}},{"kind":"Field","name":{"kind":"Name","value":"maximumTravelDistance"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"courses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"courseId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"mealOptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"meal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mealId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageUrls"}},{"kind":"Field","name":{"kind":"Name","value":"basePrice"}},{"kind":"Field","name":{"kind":"Name","value":"basePriceCustomers"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerAdult"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerChild"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"allergies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findAll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allergyId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"stripePublishableKey"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignedInUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isCook"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<GetPublicMenuPageDataQuery, GetPublicMenuPageDataQueryVariables>;
export const GetPublicMenusPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPublicMenusPageData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"request"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FindManyPublicMenusRequest"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"signedInUser"},"name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignedInUser"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"publicMenus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findMany"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"request"},"value":{"kind":"Variable","name":{"kind":"Name","value":"request"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"menuId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"kitchen"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kitchenId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cook"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cookId"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageUrls"}},{"kind":"Field","name":{"kind":"Name","value":"basePrice"}},{"kind":"Field","name":{"kind":"Name","value":"basePriceCustomers"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerAdult"}},{"kind":"Field","name":{"kind":"Name","value":"pricePerChild"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"courseCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignedInUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isCook"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<GetPublicMenusPageDataQuery, GetPublicMenusPageDataQueryVariables>;
export const UserBookingRequestConfirmPaymentSetupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UserBookingRequestConfirmPaymentSetup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookingRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"success"},"name":{"kind":"Name","value":"confirmPaymentSetup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookingRequestId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookingRequestId"}}}]}]}}]}}]}}]} as unknown as DocumentNode<UserBookingRequestConfirmPaymentSetupMutation, UserBookingRequestConfirmPaymentSetupMutationVariables>;
export const GetProfilePersonalInformationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProfilePersonalInformation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"acceptedTerms"}},{"kind":"Field","name":{"kind":"Name","value":"acceptedPrivacyPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isCook"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addressId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"postCode"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"houseNumber"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"emailAddressUpdate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumberUpdate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetProfilePersonalInformationQuery, GetProfilePersonalInformationQueryVariables>;
export const GetProfileBookingsPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProfileBookingsPageData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"signedInUser"},"name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignedInUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bookingRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findMany"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookingRequestId"}},{"kind":"Field","name":{"kind":"Name","value":"globalBookingRequestId"}},{"kind":"Field","name":{"kind":"Name","value":"adultParticipants"}},{"kind":"Field","name":{"kind":"Name","value":"children"}},{"kind":"Field","name":{"kind":"Name","value":"dateTime"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"userAccepted"}},{"kind":"Field","name":{"kind":"Name","value":"cookAccepted"}},{"kind":"Field","name":{"kind":"Name","value":"kitchenId"}},{"kind":"Field","name":{"kind":"Name","value":"occasion"}},{"kind":"Field","name":{"kind":"Name","value":"preparationTime"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"cook"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cookId"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"configuredMenu"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"globalBookingRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findMany"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"globalBookingRequestId"}},{"kind":"Field","name":{"kind":"Name","value":"children"}},{"kind":"Field","name":{"kind":"Name","value":"adultParticipants"}},{"kind":"Field","name":{"kind":"Name","value":"occasion"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"dateTime"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"priceClass"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"min"}},{"kind":"Field","name":{"kind":"Name","value":"max"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignedInUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isCook"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<GetProfileBookingsPageDataQuery, GetProfileBookingsPageDataQueryVariables>;
export const GetProfileFavoriteCooksPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProfileFavoriteCooksPageData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"signedInUser"},"name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignedInUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"followings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findAll"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cookId"}},{"kind":"Field","name":{"kind":"Name","value":"cook"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}}]}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignedInUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isCook"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<GetProfileFavoriteCooksPageDataQuery, GetProfileFavoriteCooksPageDataQueryVariables>;
export const GetProfilePersonalInformationPageDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProfilePersonalInformationPageData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"signedInUser"},"name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SignedInUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"birthDate"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"acceptedTerms"}},{"kind":"Field","name":{"kind":"Name","value":"acceptedPrivacyPolicy"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isCook"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addressId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"postCode"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"houseNumber"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"emailAddressUpdate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumberUpdate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SignedInUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isCook"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}}]}}]} as unknown as DocumentNode<GetProfilePersonalInformationPageDataQuery, GetProfilePersonalInformationPageDataQueryVariables>;