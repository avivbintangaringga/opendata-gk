import axios, { AxiosInstance } from "axios";
import {
  DetailsArrayResponse,
  DetailsResponse,
  PackageResponse,
  PackageResultResponse,
  StringArrayResponse,
  DatastoreSearchResponse,
} from "./models";

const BASE_URL =
  import.meta.env.VITE_CORS_PROXY +
  import.meta.env.VITE_CKAN_BASE_URL +
  "/api/3";

export default class CkanApi {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
    });
  }

  // Get organization list
  async getOrganizations(q = "", sort = "title+asc") {
    return this.axiosInstance.get<DetailsArrayResponse>(
      `/action/organization_list?all_fields=true&sort=${sort}&q=${q}`
    );
  }

  // Get organization details
  async getOrganizationDetails(id: string) {
    return this.axiosInstance.get<DetailsResponse>(
      `/action/organization_show?id=${id}`
    );
  }

  // Get groups list
  async getGroups(q = "", sort = "title+asc") {
    return this.axiosInstance.get<DetailsArrayResponse>(
      `/action/group_list?all_fields=true&sort=${sort}&q=${q}`
    );
  }

  // Get group details
  async getGroupDetails(id: string) {
    return this.axiosInstance.get<DetailsResponse>(
      `/action/group_show?id=${id}`
    );
  }

  // Get package list
  async getPackages() {
    return this.axiosInstance.get<StringArrayResponse>("/action/package_list");
  }

  // Get package details
  async getPackageDetails(id: string) {
    return this.axiosInstance.get<PackageResponse>(
      `/action/package_show?id=${id}`
    );
  }

  // Search packages
  async searchPackages(
    q = "",
    skip = 0,
    num_items = 20,
    sort = "score+desc,+metadata_modified+desc",
    organization: string | null = null,
    groups: string[] = [],
    tags: string[] = []
  ) {
    q = encodeURIComponent(q.trim());
    q = `"${q}"`;
    skip = skip < 0 ? 0 : skip;

    if (organization) {
      q += ` AND organization:"${organization.trim()}"`;
    }

    if (groups) {
      groups.forEach((group) => {
        q += ` AND groups:"${group.trim()}"`;
      });
    }

    if (tags) {
      tags.forEach((tag) => {
        q += ` AND tags:"${tag.trim()}"`;
      });
    }

    const url = `/action/package_search?q=${q}&start=${skip}&rows=${num_items}&facet.field=["tags","organization","groups"]&sort=${sort}`;
    console.log(url);
    return this.axiosInstance.get<PackageResultResponse>(url);
  }

  async searchDatastore(id: string, limit = 32000) {
    const url = `/action/datastore_search?limit=${limit}&resource_id=${id}`;
    console.log(url);
    return this.axiosInstance.get<DatastoreSearchResponse>(url);
  }
}

export const ckanApi = new CkanApi();
