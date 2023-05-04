import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICriteriaSet, NewCriteriaSet } from '../criteria-set.model';

export type PartialUpdateCriteriaSet = Partial<ICriteriaSet> & Pick<ICriteriaSet, 'id'>;

export type EntityResponseType = HttpResponse<ICriteriaSet>;
export type EntityArrayResponseType = HttpResponse<ICriteriaSet[]>;

@Injectable({ providedIn: 'root' })
export class CriteriaSetService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/criteria-sets');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(criteriaSet: NewCriteriaSet): Observable<EntityResponseType> {
    return this.http.post<ICriteriaSet>(this.resourceUrl, criteriaSet, { observe: 'response' });
  }

  update(criteriaSet: ICriteriaSet): Observable<EntityResponseType> {
    return this.http.put<ICriteriaSet>(`${this.resourceUrl}/${this.getCriteriaSetIdentifier(criteriaSet)}`, criteriaSet, {
      observe: 'response',
    });
  }

  partialUpdate(criteriaSet: PartialUpdateCriteriaSet): Observable<EntityResponseType> {
    return this.http.patch<ICriteriaSet>(`${this.resourceUrl}/${this.getCriteriaSetIdentifier(criteriaSet)}`, criteriaSet, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICriteriaSet>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICriteriaSet[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCriteriaSetIdentifier(criteriaSet: Pick<ICriteriaSet, 'id'>): number {
    return criteriaSet.id;
  }

  compareCriteriaSet(o1: Pick<ICriteriaSet, 'id'> | null, o2: Pick<ICriteriaSet, 'id'> | null): boolean {
    return o1 && o2 ? this.getCriteriaSetIdentifier(o1) === this.getCriteriaSetIdentifier(o2) : o1 === o2;
  }

  addCriteriaSetToCollectionIfMissing<Type extends Pick<ICriteriaSet, 'id'>>(
    criteriaSetCollection: Type[],
    ...criteriaSetsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const criteriaSets: Type[] = criteriaSetsToCheck.filter(isPresent);
    if (criteriaSets.length > 0) {
      const criteriaSetCollectionIdentifiers = criteriaSetCollection.map(
        criteriaSetItem => this.getCriteriaSetIdentifier(criteriaSetItem)!
      );
      const criteriaSetsToAdd = criteriaSets.filter(criteriaSetItem => {
        const criteriaSetIdentifier = this.getCriteriaSetIdentifier(criteriaSetItem);
        if (criteriaSetCollectionIdentifiers.includes(criteriaSetIdentifier)) {
          return false;
        }
        criteriaSetCollectionIdentifiers.push(criteriaSetIdentifier);
        return true;
      });
      return [...criteriaSetsToAdd, ...criteriaSetCollection];
    }
    return criteriaSetCollection;
  }
}
