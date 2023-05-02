import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICriteriaProperty, NewCriteriaProperty } from '../criteria-property.model';

export type PartialUpdateCriteriaProperty = Partial<ICriteriaProperty> & Pick<ICriteriaProperty, 'id'>;

export type EntityResponseType = HttpResponse<ICriteriaProperty>;
export type EntityArrayResponseType = HttpResponse<ICriteriaProperty[]>;

@Injectable({ providedIn: 'root' })
export class CriteriaPropertyService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/criteria-properties');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(criteriaProperty: NewCriteriaProperty): Observable<EntityResponseType> {
    return this.http.post<ICriteriaProperty>(this.resourceUrl, criteriaProperty, { observe: 'response' });
  }

  update(criteriaProperty: ICriteriaProperty): Observable<EntityResponseType> {
    return this.http.put<ICriteriaProperty>(
      `${this.resourceUrl}/${this.getCriteriaPropertyIdentifier(criteriaProperty)}`,
      criteriaProperty,
      { observe: 'response' }
    );
  }

  partialUpdate(criteriaProperty: PartialUpdateCriteriaProperty): Observable<EntityResponseType> {
    return this.http.patch<ICriteriaProperty>(
      `${this.resourceUrl}/${this.getCriteriaPropertyIdentifier(criteriaProperty)}`,
      criteriaProperty,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICriteriaProperty>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICriteriaProperty[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCriteriaPropertyIdentifier(criteriaProperty: Pick<ICriteriaProperty, 'id'>): number {
    return criteriaProperty.id;
  }

  compareCriteriaProperty(o1: Pick<ICriteriaProperty, 'id'> | null, o2: Pick<ICriteriaProperty, 'id'> | null): boolean {
    return o1 && o2 ? this.getCriteriaPropertyIdentifier(o1) === this.getCriteriaPropertyIdentifier(o2) : o1 === o2;
  }

  addCriteriaPropertyToCollectionIfMissing<Type extends Pick<ICriteriaProperty, 'id'>>(
    criteriaPropertyCollection: Type[],
    ...criteriaPropertiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const criteriaProperties: Type[] = criteriaPropertiesToCheck.filter(isPresent);
    if (criteriaProperties.length > 0) {
      const criteriaPropertyCollectionIdentifiers = criteriaPropertyCollection.map(
        criteriaPropertyItem => this.getCriteriaPropertyIdentifier(criteriaPropertyItem)!
      );
      const criteriaPropertiesToAdd = criteriaProperties.filter(criteriaPropertyItem => {
        const criteriaPropertyIdentifier = this.getCriteriaPropertyIdentifier(criteriaPropertyItem);
        if (criteriaPropertyCollectionIdentifiers.includes(criteriaPropertyIdentifier)) {
          return false;
        }
        criteriaPropertyCollectionIdentifiers.push(criteriaPropertyIdentifier);
        return true;
      });
      return [...criteriaPropertiesToAdd, ...criteriaPropertyCollection];
    }
    return criteriaPropertyCollection;
  }
}
