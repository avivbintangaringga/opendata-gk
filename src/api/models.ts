export type StringArrayResponse = CkanResponse<string[]>
export type DetailsArrayResponse = CkanResponse<DetailsResult[]>
export type DetailsResponse = CkanResponse<DetailsResult>
export type PackageResultResponse = CkanResponse<PackageResult>
export type PackageResponse = CkanResponse<Package>

export interface CkanResponse<T> {
    help: string
    success: boolean
    result: T
}

export interface DetailsResult {
    approval_status: string
    created: string
    description: string
    display_name: string
    id: string
    image_display_url: string
    image_url: string
    is_organization: boolean
    name: string
    num_followers: number
    package_count: number
    state: string
    title: string
    type: string
  }
  

export interface PackageResult {
    count: number
    results: Package[]
    sort: string
    search_facets: {
        tags: SearchFacet<Tag>
        organization: SearchFacet<PackageOrganization>
        groups: SearchFacet<PackageGroup>
    }
}

export interface SearchFacet<T> {
    title: string
    items: T[]
}

export interface Package {
    author: string
    author_email: string
    creator_user_id: string
    id: string
    isopen: boolean
    license_id: string
    license_title: string
    maintainer: string
    maintainer_email: string
    metadata_created: string
    metadata_modified: string
    name: string
    notes: string
    num_resources: number
    num_tags: number
    organization: PackageOrganization
    owner_org: string
    private: boolean
    state: string
    title: string
    type: string
    url: string
    version: string
    resources: Resource[]
    tags: Tag[]
    groups: PackageGroup[]
}

export interface PackageGroup {
    description: string
    display_name: string
    id: string
    image_display_url: string
    name: string
    title: string
  }
  

export interface PackageOrganization {
    id: string
    name: string
    title: string
    type: string
    description: string 
    image_url: string
    created: string
    is_organization: boolean
    approval_status: string
    state: string
}

export interface Resource {
    created: string
    datastore_active: boolean
    description: string
    format: string
    hash: string
    id: string
    last_modified: string
    metadata_modified: string
    mimetype: string
    name: string
    package_id: string
    position: number
    size: number
    state: string
    url: string
    url_type: string
}

export interface Tag {
    display_name: string
    id: string
    name: string
    state: string
}
