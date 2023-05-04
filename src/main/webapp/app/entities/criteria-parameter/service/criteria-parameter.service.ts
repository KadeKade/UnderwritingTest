import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICriteriaParameter, NewCriteriaParameter } from '../criteria-parameter.model';

export type PartialUpdateCriteriaParameter = Partial<ICriteriaParameter> & Pick<ICriteriaParameter, 'id'>;

export type EntityResponseType = HttpResponse<ICriteriaParameter>;
export type EntityArrayResponseType = HttpResponse<ICriteriaParameter[]>;

@Injectable({ providedIn: 'root' })
export class CriteriaParameterService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/criteria-parameters');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(criteriaParameter: NewCriteriaParameter): Observable<EntityResponseType> {
    return this.http.post<ICriteriaParameter>(this.resourceUrl, criteriaParameter, { observe: 'response' });
  }

  update(criteriaParameter: ICriteriaParameter): Observable<EntityResponseType> {
    return this.http.put<ICriteriaParameter>(
      `${this.resourceUrl}/${this.getCriteriaParameterIdentifier(criteriaParameter)}`,
      criteriaParameter,
      { observe: 'response' }
    );
  }

  partialUpdate(criteriaParameter: PartialUpdateCriteriaParameter): Observable<EntityResponseType> {
    return this.http.patch<ICriteriaParameter>(
      `${this.resourceUrl}/${this.getCriteriaParameterIdentifier(criteriaParameter)}`,
      criteriaParameter,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICriteriaParameter>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICriteriaParameter[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCriteriaParameterIdentifier(criteriaParameter: Pick<ICriteriaParameter, 'id'>): number {
    return criteriaParameter.id;
  }

  compareCriteriaParameter(o1: Pick<ICriteriaParameter, 'id'> | null, o2: Pick<ICriteriaParameter, 'id'> | null): boolean {
    return o1 && o2 ? this.getCriteriaParameterIdentifier(o1) === this.getCriteriaParameterIdentifier(o2) : o1 === o2;
  }

  addCriteriaParameterToCollectionIfMissing<Type extends Pick<ICriteriaParameter, 'id'>>(
    criteriaParameterCollection: Type[],
    ...criteriaParametersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const criteriaParameters: Type[] = criteriaParametersToCheck.filter(isPresent);
    if (criteriaParameters.length > 0) {
      const criteriaParameterCollectionIdentifiers = criteriaParameterCollection.map(
        criteriaParameterItem => this.getCriteriaParameterIdentifier(criteriaParameterItem)!
      );
      const criteriaParametersToAdd = criteriaParameters.filter(criteriaParameterItem => {
        const criteriaParameterIdentifier = this.getCriteriaParameterIdentifier(criteriaParameterItem);
        if (criteriaParameterCollectionIdentifiers.includes(criteriaParameterIdentifier)) {
          return false;
        }
        criteriaParameterCollectionIdentifiers.push(criteriaParameterIdentifier);
        return true;
      });
      return [...criteriaParametersToAdd, ...criteriaParameterCollection];
    }
    return criteriaParameterCollection;
  }
}
