/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "fragment AllergyOption on Allergy {\n  allergyId\n  title\n}": types.AllergyOptionFragmentDoc,
    "fragment CategoryOption on Category {\n  categoryId\n  title\n}": types.CategoryOptionFragmentDoc,
    "fragment KitchenOption on Kitchen {\n  kitchenId\n  title\n}": types.KitchenOptionFragmentDoc,
    "fragment SignedInUser on User {\n  userId\n  firstName\n  profilePictureUrl\n  isCook\n  isAdmin\n}": types.SignedInUserFragmentDoc,
    "query GetPageData {\n  users {\n    signedInUser: me {\n      ...SignedInUser\n    }\n  }\n}": types.GetPageDataDocument,
    "query GetPrivacyPolicyPageData {\n  users {\n    signedInUser: me {\n      ...SignedInUser\n    }\n  }\n  publicPrivacyPolicyUpdates {\n    findLatest {\n      privacyPolicyUpdateId\n      englishText\n      germanText\n      createdAt\n    }\n  }\n}": types.GetPrivacyPolicyPageDataDocument,
    "query GetTermsAndConditionsPageData {\n  users {\n    signedInUser: me {\n      ...SignedInUser\n    }\n  }\n  publicTermsUpdates {\n    findLatest {\n      termsUpdateId\n      englishText\n      germanText\n      createdAt\n    }\n  }\n}": types.GetTermsAndConditionsPageDataDocument,
    "query GetPublicCookPageData($cookId: String!) {\n  users {\n    signedInUser: me {\n      ...SignedInUser\n    }\n  }\n  publicCooks {\n    findOne(cookId: $cookId) {\n      cookId\n      user {\n        userId\n        firstName\n        profilePictureUrl\n      }\n      rank\n      biography\n      location {\n        latitude\n        longitude\n      }\n      city\n      travelExpenses\n      createdAt\n      languages {\n        languageId\n        title\n      }\n      menus {\n        title\n        pricePerChild\n        pricePerAdult\n        preparationTime\n        menuId\n        kitchen {\n          kitchenId\n          title\n        }\n        basePrice\n        basePriceCustomers\n        categories {\n          categoryId\n          title\n        }\n        imageUrls\n        currencyCode\n        description\n        greetingFromKitchen\n        createdAt\n      }\n    }\n  }\n  categories {\n    findAll {\n      ...CategoryOption\n    }\n  }\n  kitchens {\n    findAll {\n      ...KitchenOption\n    }\n  }\n  allergies {\n    findAll {\n      ...AllergyOption\n    }\n  }\n}": types.GetPublicCookPageDataDocument,
    "query GetPublicCooksPageData($request: FindManyPublicCooksRequest!) {\n  users {\n    signedInUser: me {\n      ...SignedInUser\n    }\n  }\n  publicCooks {\n    findMany(request: $request) {\n      cookId\n      user {\n        userId\n        firstName\n        profilePictureUrl\n      }\n      rank\n      biography\n      location {\n        latitude\n        longitude\n      }\n      city\n      travelExpenses\n      createdAt\n    }\n  }\n}": types.GetPublicCooksPageDataDocument,
    "query GetHomePageData {\n  users {\n    signedInUser: me {\n      ...SignedInUser\n    }\n  }\n  publicCooks {\n    findHeroes {\n      cookId\n      user {\n        userId\n        firstName\n        profilePictureUrl\n      }\n      rank\n      biography\n      location {\n        latitude\n        longitude\n      }\n      city\n      travelExpenses\n      createdAt\n    }\n  }\n  publicMenus {\n    findHeroes {\n      menuId\n      title\n      description\n      kitchen {\n        kitchenId\n        title\n      }\n      cook {\n        cookId\n        rank\n        user {\n          firstName\n          profilePictureUrl\n        }\n      }\n      categories {\n        categoryId\n        title\n      }\n      imageUrls\n      basePrice\n      basePriceCustomers\n      pricePerAdult\n      pricePerChild\n      currencyCode\n    }\n  }\n}": types.GetHomePageDataDocument,
    "query GetPublicMenuPageData($menuId: String!) {\n  users {\n    signedInUser: me {\n      ...SignedInUser\n    }\n  }\n  publicMenus {\n    findOne(menuId: $menuId) {\n      menuId\n      title\n      description\n      greetingFromKitchen\n      kitchen {\n        kitchenId\n        title\n      }\n      cook {\n        cookId\n        rank\n        city\n        travelExpenses\n        maximumTravelDistance\n        user {\n          firstName\n          profilePictureUrl\n        }\n        location {\n          latitude\n          longitude\n        }\n      }\n      categories {\n        categoryId\n        title\n      }\n      courses {\n        index\n        courseId\n        title\n        mealOptions {\n          index\n          meal {\n            mealId\n            title\n            description\n            type\n            imageUrl\n          }\n        }\n      }\n      imageUrls\n      basePrice\n      basePriceCustomers\n      pricePerAdult\n      pricePerChild\n      currencyCode\n    }\n  }\n  allergies {\n    findAll {\n      allergyId\n      title\n    }\n  }\n  stripePublishableKey\n}": types.GetPublicMenuPageDataDocument,
    "query GetPublicMenusPageData($request: FindManyPublicMenusRequest!) {\n  users {\n    signedInUser: me {\n      ...SignedInUser\n    }\n  }\n  publicMenus {\n    findMany(request: $request) {\n      menuId\n      title\n      description\n      kitchen {\n        kitchenId\n        title\n      }\n      cook {\n        cookId\n        rank\n        user {\n          firstName\n          profilePictureUrl\n        }\n      }\n      categories {\n        categoryId\n        title\n      }\n      imageUrls\n      basePrice\n      basePriceCustomers\n      pricePerAdult\n      pricePerChild\n      currencyCode\n    }\n  }\n}": types.GetPublicMenusPageDataDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment AllergyOption on Allergy {\n  allergyId\n  title\n}"): (typeof documents)["fragment AllergyOption on Allergy {\n  allergyId\n  title\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment CategoryOption on Category {\n  categoryId\n  title\n}"): (typeof documents)["fragment CategoryOption on Category {\n  categoryId\n  title\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment KitchenOption on Kitchen {\n  kitchenId\n  title\n}"): (typeof documents)["fragment KitchenOption on Kitchen {\n  kitchenId\n  title\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment SignedInUser on User {\n  userId\n  firstName\n  profilePictureUrl\n  isCook\n  isAdmin\n}"): (typeof documents)["fragment SignedInUser on User {\n  userId\n  firstName\n  profilePictureUrl\n  isCook\n  isAdmin\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetPageData {\n  users {\n    signedInUser: me {\n      ...SignedInUser\n    }\n  }\n}"): (typeof documents)["query GetPageData {\n  users {\n    signedInUser: me {\n      ...SignedInUser\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetPrivacyPolicyPageData {\n  users {\n    signedInUser: me {\n      ...SignedInUser\n    }\n  }\n  publicPrivacyPolicyUpdates {\n    findLatest {\n      privacyPolicyUpdateId\n      englishText\n      germanText\n      createdAt\n    }\n  }\n}"): (typeof documents)["query GetPrivacyPolicyPageData {\n  users {\n    signedInUser: me {\n      ...SignedInUser\n    }\n  }\n  publicPrivacyPolicyUpdates {\n    findLatest {\n      privacyPolicyUpdateId\n      englishText\n      germanText\n      createdAt\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetTermsAndConditionsPageData {\n  users {\n    signedInUser: me {\n      ...SignedInUser\n    }\n  }\n  publicTermsUpdates {\n    findLatest {\n      termsUpdateId\n      englishText\n      germanText\n      createdAt\n    }\n  }\n}"): (typeof documents)["query GetTermsAndConditionsPageData {\n  users {\n    signedInUser: me {\n      ...SignedInUser\n    }\n  }\n  publicTermsUpdates {\n    findLatest {\n      termsUpdateId\n      englishText\n      germanText\n      createdAt\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetPublicCookPageData($cookId: String!) {\n  users {\n    signedInUser: me {\n      ...SignedInUser\n    }\n  }\n  publicCooks {\n    findOne(cookId: $cookId) {\n      cookId\n      user {\n        userId\n        firstName\n        profilePictureUrl\n      }\n      rank\n      biography\n      location {\n        latitude\n        longitude\n      }\n      city\n      travelExpenses\n      createdAt\n      languages {\n        languageId\n        title\n      }\n      menus {\n        title\n        pricePerChild\n        pricePerAdult\n        preparationTime\n        menuId\n        kitchen {\n          kitchenId\n          title\n        }\n        basePrice\n        basePriceCustomers\n        categories {\n          categoryId\n          title\n        }\n        imageUrls\n        currencyCode\n        description\n        greetingFromKitchen\n        createdAt\n      }\n    }\n  }\n  categories {\n    findAll {\n      ...CategoryOption\n    }\n  }\n  kitchens {\n    findAll {\n      ...KitchenOption\n    }\n  }\n  allergies {\n    findAll {\n      ...AllergyOption\n    }\n  }\n}"): (typeof documents)["query GetPublicCookPageData($cookId: String!) {\n  users {\n    signedInUser: me {\n      ...SignedInUser\n    }\n  }\n  publicCooks {\n    findOne(cookId: $cookId) {\n      cookId\n      user {\n        userId\n        firstName\n        profilePictureUrl\n      }\n      rank\n      biography\n      location {\n        latitude\n        longitude\n      }\n      city\n      travelExpenses\n      createdAt\n      languages {\n        languageId\n        title\n      }\n      menus {\n        title\n        pricePerChild\n        pricePerAdult\n        preparationTime\n        menuId\n        kitchen {\n          kitchenId\n          title\n        }\n        basePrice\n        basePriceCustomers\n        categories {\n          categoryId\n          title\n        }\n        imageUrls\n        currencyCode\n        description\n        greetingFromKitchen\n        createdAt\n      }\n    }\n  }\n  categories {\n    findAll {\n      ...CategoryOption\n    }\n  }\n  kitchens {\n    findAll {\n      ...KitchenOption\n    }\n  }\n  allergies {\n    findAll {\n      ...AllergyOption\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetPublicCooksPageData($request: FindManyPublicCooksRequest!) {\n  users {\n    signedInUser: me {\n      ...SignedInUser\n    }\n  }\n  publicCooks {\n    findMany(request: $request) {\n      cookId\n      user {\n        userId\n        firstName\n        profilePictureUrl\n      }\n      rank\n      biography\n      location {\n        latitude\n        longitude\n      }\n      city\n      travelExpenses\n      createdAt\n    }\n  }\n}"): (typeof documents)["query GetPublicCooksPageData($request: FindManyPublicCooksRequest!) {\n  users {\n    signedInUser: me {\n      ...SignedInUser\n    }\n  }\n  publicCooks {\n    findMany(request: $request) {\n      cookId\n      user {\n        userId\n        firstName\n        profilePictureUrl\n      }\n      rank\n      biography\n      location {\n        latitude\n        longitude\n      }\n      city\n      travelExpenses\n      createdAt\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetHomePageData {\n  users {\n    signedInUser: me {\n      ...SignedInUser\n    }\n  }\n  publicCooks {\n    findHeroes {\n      cookId\n      user {\n        userId\n        firstName\n        profilePictureUrl\n      }\n      rank\n      biography\n      location {\n        latitude\n        longitude\n      }\n      city\n      travelExpenses\n      createdAt\n    }\n  }\n  publicMenus {\n    findHeroes {\n      menuId\n      title\n      description\n      kitchen {\n        kitchenId\n        title\n      }\n      cook {\n        cookId\n        rank\n        user {\n          firstName\n          profilePictureUrl\n        }\n      }\n      categories {\n        categoryId\n        title\n      }\n      imageUrls\n      basePrice\n      basePriceCustomers\n      pricePerAdult\n      pricePerChild\n      currencyCode\n    }\n  }\n}"): (typeof documents)["query GetHomePageData {\n  users {\n    signedInUser: me {\n      ...SignedInUser\n    }\n  }\n  publicCooks {\n    findHeroes {\n      cookId\n      user {\n        userId\n        firstName\n        profilePictureUrl\n      }\n      rank\n      biography\n      location {\n        latitude\n        longitude\n      }\n      city\n      travelExpenses\n      createdAt\n    }\n  }\n  publicMenus {\n    findHeroes {\n      menuId\n      title\n      description\n      kitchen {\n        kitchenId\n        title\n      }\n      cook {\n        cookId\n        rank\n        user {\n          firstName\n          profilePictureUrl\n        }\n      }\n      categories {\n        categoryId\n        title\n      }\n      imageUrls\n      basePrice\n      basePriceCustomers\n      pricePerAdult\n      pricePerChild\n      currencyCode\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetPublicMenuPageData($menuId: String!) {\n  users {\n    signedInUser: me {\n      ...SignedInUser\n    }\n  }\n  publicMenus {\n    findOne(menuId: $menuId) {\n      menuId\n      title\n      description\n      greetingFromKitchen\n      kitchen {\n        kitchenId\n        title\n      }\n      cook {\n        cookId\n        rank\n        city\n        travelExpenses\n        maximumTravelDistance\n        user {\n          firstName\n          profilePictureUrl\n        }\n        location {\n          latitude\n          longitude\n        }\n      }\n      categories {\n        categoryId\n        title\n      }\n      courses {\n        index\n        courseId\n        title\n        mealOptions {\n          index\n          meal {\n            mealId\n            title\n            description\n            type\n            imageUrl\n          }\n        }\n      }\n      imageUrls\n      basePrice\n      basePriceCustomers\n      pricePerAdult\n      pricePerChild\n      currencyCode\n    }\n  }\n  allergies {\n    findAll {\n      allergyId\n      title\n    }\n  }\n  stripePublishableKey\n}"): (typeof documents)["query GetPublicMenuPageData($menuId: String!) {\n  users {\n    signedInUser: me {\n      ...SignedInUser\n    }\n  }\n  publicMenus {\n    findOne(menuId: $menuId) {\n      menuId\n      title\n      description\n      greetingFromKitchen\n      kitchen {\n        kitchenId\n        title\n      }\n      cook {\n        cookId\n        rank\n        city\n        travelExpenses\n        maximumTravelDistance\n        user {\n          firstName\n          profilePictureUrl\n        }\n        location {\n          latitude\n          longitude\n        }\n      }\n      categories {\n        categoryId\n        title\n      }\n      courses {\n        index\n        courseId\n        title\n        mealOptions {\n          index\n          meal {\n            mealId\n            title\n            description\n            type\n            imageUrl\n          }\n        }\n      }\n      imageUrls\n      basePrice\n      basePriceCustomers\n      pricePerAdult\n      pricePerChild\n      currencyCode\n    }\n  }\n  allergies {\n    findAll {\n      allergyId\n      title\n    }\n  }\n  stripePublishableKey\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetPublicMenusPageData($request: FindManyPublicMenusRequest!) {\n  users {\n    signedInUser: me {\n      ...SignedInUser\n    }\n  }\n  publicMenus {\n    findMany(request: $request) {\n      menuId\n      title\n      description\n      kitchen {\n        kitchenId\n        title\n      }\n      cook {\n        cookId\n        rank\n        user {\n          firstName\n          profilePictureUrl\n        }\n      }\n      categories {\n        categoryId\n        title\n      }\n      imageUrls\n      basePrice\n      basePriceCustomers\n      pricePerAdult\n      pricePerChild\n      currencyCode\n    }\n  }\n}"): (typeof documents)["query GetPublicMenusPageData($request: FindManyPublicMenusRequest!) {\n  users {\n    signedInUser: me {\n      ...SignedInUser\n    }\n  }\n  publicMenus {\n    findMany(request: $request) {\n      menuId\n      title\n      description\n      kitchen {\n        kitchenId\n        title\n      }\n      cook {\n        cookId\n        rank\n        user {\n          firstName\n          profilePictureUrl\n        }\n      }\n      categories {\n        categoryId\n        title\n      }\n      imageUrls\n      basePrice\n      basePriceCustomers\n      pricePerAdult\n      pricePerChild\n      currencyCode\n    }\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;