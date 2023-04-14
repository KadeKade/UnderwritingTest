import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICriteriaPropery, NewCriteriaPropery } from '../criteria-propery.model';

export type PartialUpdateCriteriaPropery = Partial<ICriteriaPropery> & Pick<ICriteriaPropery, 'id'>;

export type EntityResponseType = HttpResponse<ICriteriaPropery>;
export type EntityArrayResponseType = HttpResponse<ICriteriaPropery[]>;

@Injectable({ providedIn: 'root' })
export class CriteriaProperyService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/criteria-properies');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(criteriaPropery: NewCriteriaPropery): Observable<EntityResponseType> {
    return this.http.post<ICriteriaPropery>(this.resourceUrl, criteriaPropery, { observe: 'response' });
  }

  update(criteriaPropery: ICriteriaPropery): Observable<EntityResponseType> {
    return this.http.put<ICriteriaPropery>(`${this.resourceUrl}/${this.getCriteriaProperyIdentifier(criteriaPropery)}`, criteriaPropery, {
      observe: 'response',
    });
  }

  partialUpdate(criteriaPropery: PartialUpdateCriteriaPropery): Observable<EntityResponseType> {
    return this.http.patch<ICriteriaPropery>(`${this.resourceUrl}/${this.getCriteriaProperyIdentifier(criteriaPropery)}`, criteriaPropery, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICriteriaPropery>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICriteriaPropery[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCriteriaProperyIdentifier(criteriaPropery: Pick<ICriteriaPropery, 'id'>): number {
    return criteriaPropery.id;
  }

  compareCriteriaPropery(o1: Pick<ICriteriaPropery, 'id'> | null, o2: Pick<ICriteriaPropery, 'id'> | null): boolean {
    return o1 && o2 ? this.getCriteriaProperyIdentifier(o1) === this.getCriteriaProperyIdentifier(o2) : o1 === o2;
  }

  addCriteriaProperyToCollectionIfMissing<Type extends Pick<ICriteriaPropery, 'id'>>(
    criteriaProperyCollection: Type[],
    ...criteriaProperiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const criteriaProperies: Type[] = criteriaProperiesToCheck.filter(isPresent);
    if (criteriaProperies.length > 0) {
      const criteriaProperyCollectionIdentifiers = criteriaProperyCollection.map(
        criteriaProperyItem => this.getCriteriaProperyIdentifier(criteriaProperyItem)!
      );
      const criteriaProperiesToAdd = criteriaProperies.filter(criteriaProperyItem => {
        const criteriaProperyIdentifier = this.getCriteriaProperyIdentifier(criteriaProperyItem);
        if (criteriaProperyCollectionIdentifiers.includes(criteriaProperyIdentifier)) {
          return false;
        }
        criteriaProperyCollectionIdentifiers.push(criteriaProperyIdentifier);
        return true;
      });
      return [...criteriaProperiesToAdd, ...criteriaProperyCollection];
    }
    return criteriaProperyCollection;
  }
}
